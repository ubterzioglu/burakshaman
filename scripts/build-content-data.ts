/**
 * Dev-only: transforms scripts/extracted-content.json into the typed data module
 * src/lib/content-data.ts consumed by content.ts (static fallback) and prisma/seed.ts.
 * Run after extract-content.ts:  npx tsx scripts/build-content-data.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Item = Record<string, any> & { slug: string; type: string; lang: string; title: string };

const data = JSON.parse(
  readFileSync(join(process.cwd(), "scripts/extracted-content.json"), "utf8"),
);
const items: Item[] = data.items;

/** Merge a TR item with its EN counterpart (same type+slug). */
function grouped(type: string) {
  const tr = items.filter((i) => i.type === type && i.lang === "tr");
  const en = items.filter((i) => i.type === type && i.lang === "en");
  return { tr, enBySlug: new Map(en.map((e) => [e.slug, e])) };
}

const slugsToSkip = new Set(["contact", "iletisim", "ornek"]); // listing/duplicate/system pages

function digitalFor(slug: string): boolean {
  return !/ciltli|kagit-kapak/i.test(slug);
}
function categoryFor(slug: string): string {
  if (/^hcd/i.test(slug)) return "Kitaplar";
  return "Dijital Ürünler";
}

const products = grouped("product");
const realProducts = products.tr.map((p) => {
  const en = products.enBySlug.get(p.slug);
  return {
    slug: p.slug,
    name: p.title,
    nameEn: en?.title,
    category: categoryFor(p.slug),
    priceCents: p.priceCents ?? 0,
    image: p.image,
    description: p.excerpt || p.body?.replace(/<[^>]+>/g, " ").slice(0, 240) || p.title,
    descriptionEn: en?.excerpt,
    body: p.body || "",
    bodyEn: en?.body,
    digital: digitalFor(p.slug),
  };
});

const posts = grouped("post");
const realPosts = posts.tr
  .filter((p) => (p.body || "").length > 40) // drop video-only / empty posts
  .map((p) => {
    const en = posts.enBySlug.get(p.slug);
    return {
      slug: p.slug,
      title: p.title,
      titleEn: en?.title,
      excerpt: p.excerpt || p.title,
      excerptEn: en?.excerpt,
      body: p.body,
      bodyEn: en?.body,
      image: p.image,
    };
  });

const pages = grouped("page");
const realPages = pages.tr
  .filter((p) => !slugsToSkip.has(p.slug) && (p.body || "").length > 20)
  .map((p) => {
    const en = pages.enBySlug.get(p.slug);
    return {
      slug: p.slug,
      title: p.title,
      titleEn: en?.title,
      body: p.body,
      bodyEn: en?.body,
    };
  });

const events = grouped("event");
const realEvents = events.tr.map((e) => ({
  slug: e.slug,
  title: e.title,
  description: (e.excerpt || e.body?.replace(/<[^>]+>/g, " ").slice(0, 200) || e.title).trim(),
  body: e.body || "",
  image: e.image,
}));

const trainers = grouped("trainer");
const trainerTr = trainers.tr[0];
const trainerEn = trainers.enBySlug.get(trainerTr?.slug ?? "");
const realTrainer = trainerTr
  ? {
      slug: trainerTr.slug,
      name: trainerTr.title,
      bio: trainerTr.bio || "",
      bioEn: trainerEn?.bio,
      image: trainerTr.image,
    }
  : null;

function ts(v: unknown): string {
  return JSON.stringify(v, null, 2);
}

const out = `// AUTO-GENERATED from the WP Rocket cache by scripts/build-content-data.ts. Do not edit by hand.
// Source: ref/_/public_html/wp-content/cache/wp-rocket/shamanlife.com

export type RealProduct = {
  slug: string; name: string; nameEn?: string; category: string; priceCents: number;
  image?: string; description: string; descriptionEn?: string; body: string; bodyEn?: string; digital: boolean;
};
export type RealPost = {
  slug: string; title: string; titleEn?: string; excerpt: string; excerptEn?: string;
  body: string; bodyEn?: string; image?: string;
};
export type RealPage = { slug: string; title: string; titleEn?: string; body: string; bodyEn?: string };
export type RealEvent = { slug: string; title: string; description: string; body: string; image?: string };
export type RealTrainer = { slug: string; name: string; bio: string; bioEn?: string; image?: string };

export const realProducts: RealProduct[] = ${ts(realProducts)};

export const realPosts: RealPost[] = ${ts(realPosts)};

export const realPages: RealPage[] = ${ts(realPages)};

export const realEvents: RealEvent[] = ${ts(realEvents)};

export const realTrainer: RealTrainer | null = ${ts(realTrainer)};
`;

writeFileSync(join(process.cwd(), "src/lib/content-data.ts"), out, "utf8");
console.log("Wrote src/lib/content-data.ts:", {
  products: realProducts.length,
  posts: realPosts.length,
  pages: realPages.length,
  events: realEvents.length,
  trainer: realTrainer ? 1 : 0,
});
