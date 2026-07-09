/**
 * Dev-only one-off extractor: recovers the real Shaman Life content from the
 * WP Rocket HTML cache (the live site was fully rendered there) into structured
 * JSON + copies referenced images into public/assets/wp/.
 *
 * Run: npx tsx scripts/extract-content.ts
 * Output: scripts/extracted-content.json  (reviewed, then wired into content.ts/seed)
 *
 * No external deps — targeted string/regex parsing of the known WordPress/helix markup.
 */
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  statSync,
} from "node:fs";
import { join } from "node:path";

const CACHE_ROOT = join(
  process.cwd(),
  "ref/_/public_html/wp-content/cache/wp-rocket/shamanlife.com",
);
const UPLOADS_ROOT = join(process.cwd(), "ref/_/public_html/wp-content/uploads");
const ASSETS_OUT = join(process.cwd(), "public/assets/wp");

// ---------- helpers ----------

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&#39;": "'",
  "&nbsp;": " ",
  "&hellip;": "…",
  "&#8211;": "–",
  "&#8212;": "—",
  "&#8216;": "‘",
  "&#8217;": "’",
  "&#8220;": "“",
  "&#8221;": "”",
  "&#8230;": "…",
  "&#8378;": "₺",
  "&raquo;": "»",
  "&laquo;": "«",
};

function decodeEntities(s: string): string {
  let out = s;
  for (const [k, v] of Object.entries(ENTITIES)) out = out.split(k).join(v);
  out = out.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
  out = out.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)));
  return out;
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

/** Return outerHTML of the element whose opening `<` is at openIdx (balanced by tag name). */
function sliceElement(html: string, openIdx: number): string {
  const nameMatch = /^<([a-zA-Z0-9]+)/.exec(html.slice(openIdx, openIdx + 24));
  if (!nameMatch) return "";
  const tag = nameMatch[1];
  const re = new RegExp(`<${tag}(?:\\s|>|/)|</${tag}>`, "gi");
  re.lastIndex = openIdx;
  let depth = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[0].startsWith("</")) {
      depth--;
      if (depth === 0) return html.slice(openIdx, re.lastIndex);
    } else {
      depth++;
    }
  }
  return html.slice(openIdx);
}

/** Outer HTML of the first element whose class contains `className`. */
function elementByClass(html: string, className: string): string | null {
  const re = new RegExp(`<([a-zA-Z0-9]+)[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>`, "i");
  const m = re.exec(html);
  if (!m) return null;
  return sliceElement(html, m.index);
}

/** Locate the main content region (article body / WPBakery content / page main). */
function findRegion(html: string, preferClass?: string): string {
  if (preferClass) {
    const pref = elementByClass(html, preferClass);
    if (pref) return pref;
  }
  const article = elementByClass(html, "post-wrap");
  if (article) return article;
  const anyArticle = /<article[^>]*>/i.exec(html);
  if (anyArticle) return sliceElement(html, anyArticle.index);
  const main = /<(?:main|div)[^>]*(?:id="main"|class="[^"]*(?:site-main|main-content|page-content))/i.exec(html);
  if (main) return sliceElement(html, main.index);
  return html;
}

const BLOCK_RE = /<(p|h2|h3|h4|blockquote|ul|ol|figure|pre)(?=\s|>)/gi;
const NOISE = /(yorum|paylaş|önceki yazı|sonraki yazı|kategori|etiket|\bshare\b|comment|read more|devamını oku|©|copyright|all rights)/i;

/** Collect top-level block elements from a region into clean HTML. */
function collectBlocks(region: string): { body: string; excerpt: string } {
  const blocks: string[] = [];
  let cursor = 0;
  let m: RegExpExecArray | null;
  BLOCK_RE.lastIndex = 0;
  while ((m = BLOCK_RE.exec(region))) {
    if (m.index < cursor) continue;
    const el = sliceElement(region, m.index);
    cursor = m.index + el.length;
    BLOCK_RE.lastIndex = cursor;
    const text = stripTags(el);
    if (text.length < 2) continue;
    if (text.length < 40 && NOISE.test(text)) continue;
    const clean = sanitize(el, copyImage);
    if (clean) blocks.push(clean);
  }
  const excerpt = blocks.length ? stripTags(blocks[0]).slice(0, 200).trim() : "";
  return { body: blocks.join("\n"), excerpt };
}

const ALLOWED = new Set([
  "p", "h2", "h3", "h4", "ul", "ol", "li", "blockquote",
  "strong", "em", "b", "i", "a", "br", "img", "figure", "figcaption",
]);

/** Clean WPBakery/helix markup into simple, attribute-stripped HTML. */
function sanitize(html: string, rewriteImg: (src: string) => string): string {
  let s = html;
  // drop script/style/noscript/svg/iframe/form blocks
  s = s.replace(/<(script|style|noscript|svg|form|iframe)[\s\S]*?<\/\1>/gi, " ");
  // rewrite <img ...> to just src+alt
  s = s.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = /(?:data-src|src)="([^"]+)"/i.exec(tag)?.[1];
    const alt = /alt="([^"]*)"/i.exec(tag)?.[1] ?? "";
    if (!src || /data:image|\.svg|blank\.gif/i.test(src)) return "";
    return `<img src="${rewriteImg(src)}" alt="${alt}" />`;
  });
  // strip attributes from all other allowed tags, drop disallowed tags entirely
  s = s.replace(/<\/?([a-zA-Z0-9]+)\b[^>]*>/g, (full, name: string) => {
    const tag = name.toLowerCase();
    if (tag === "img") return full;
    if (!ALLOWED.has(tag)) return " ";
    if (full.startsWith("</")) return `</${tag}>`;
    if (tag === "a") {
      const href = /href="([^"]+)"/i.exec(full)?.[1] ?? "#";
      return `<a href="${href}">`;
    }
    return full.endsWith("/>") ? `<${tag} />` : `<${tag}>`;
  });
  // collapse empties / whitespace
  s = s.replace(/<p>\s*<\/p>/g, "").replace(/\s+/g, " ");
  s = s.replace(/(<p>\s*(?:&nbsp;)?\s*<\/p>)/g, "");
  return decodeEntities(s).trim();
}

// ---------- image copying ----------

const copiedImages = new Set<string>();

function localUploadPath(url: string): string | null {
  const m = /wp-content\/uploads\/(.+\.(?:jpg|jpeg|png|webp|gif))/i.exec(url);
  if (!m) return null;
  return m[1];
}

function copyImage(url: string): string {
  const rel = localUploadPath(url);
  if (!rel) return url;
  // undo WP resize suffix e.g. name-600x400.jpg -> name.jpg (fall back to sized if original missing)
  const source = join(UPLOADS_ROOT, rel);
  const orig = rel.replace(/-\d+x\d+(\.[a-z]+)$/i, "$1");
  const origSource = join(UPLOADS_ROOT, orig);
  const chosenRel = existsSync(origSource) ? orig : rel;
  const chosenSource = existsSync(origSource) ? origSource : source;
  const outName = chosenRel.replace(/[\\/]/g, "__");
  const dest = join(ASSETS_OUT, outName);
  const webPath = `/assets/wp/${outName}`;
  if (copiedImages.has(outName)) return webPath;
  try {
    if (existsSync(chosenSource) && statSync(chosenSource).isFile()) {
      if (!existsSync(ASSETS_OUT)) mkdirSync(ASSETS_OUT, { recursive: true });
      copyFileSync(chosenSource, dest);
      copiedImages.add(outName);
      return webPath;
    }
  } catch {
    // ignore copy failures
  }
  return url; // fall back to remote url if not found locally
}

// ---------- per-page extraction ----------

type Item = Record<string, unknown> & { slug: string; type: string; lang: string };

function title(html: string): string {
  const t = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? "";
  return decodeEntities(t).replace(/\s*[–-]\s*Shaman Life[\s\S]*$/i, "").trim();
}

function featuredImage(html: string): string | undefined {
  const post = /<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*>/i.exec(html)?.[0];
  const src =
    (post && /(?:data-src|src)="([^"]+)"/i.exec(post)?.[1]) ||
    /wp-content\/uploads\/\d{4}\/\d{2}\/[A-Za-z0-9._-]+\.(?:jpg|jpeg|png|webp)/i
      .exec(html.replace(/cropped-[^"']+/gi, ""))?.[0];
  if (!src) return undefined;
  return copyImage(src.startsWith("http") ? src : `https://x/${src}`);
}

function priceCents(html: string): number | undefined {
  const m = /Price-amount amount"><bdi>[\s\S]*?<\/span>([\d.,]+)<\/bdi>/i.exec(html);
  const raw = m?.[1] ?? /Price-amount amount"><bdi>([\d.,]+)/i.exec(html)?.[1];
  if (!raw) return undefined;
  const normalized = raw.replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? Math.round(n * 100) : undefined;
}

const CHROME_RE =
  /<(?:div|ul|section|aside|form)[^>]*class="[^"]*\b(?:main-menu|menu-item|sub-menu|nav-menu|main-navigation|navigation|breadcrumb|widget|sidebar|site-footer|site-header|topbar|social|sharedaddy|share|related|post-nav|comments-area|comment-|footer-|header-|mobile-menu|ova-menu|megamenu)\b[^"]*"/i;

function removeMatching(html: string, re: RegExp): string {
  let s = html;
  let m: RegExpExecArray | null;
  let guard = 0;
  const local = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  local.lastIndex = 0;
  while ((m = local.exec(s)) && guard++ < 500) {
    const el = sliceElement(s, m.index);
    if (!el) break;
    s = s.slice(0, m.index) + " " + s.slice(m.index + el.length);
    local.lastIndex = 0;
  }
  return s;
}

/** Remove header/nav/footer/menu/widget chrome so only real content blocks remain. */
function stripChrome(html: string): string {
  let s = html.replace(/<(header|footer|nav)\b[\s\S]*?<\/\1>/gi, " ");
  s = removeMatching(s, CHROME_RE);
  return s;
}

function bodyHtml(html: string, preferClass?: string): { body: string; excerpt: string } {
  return collectBlocks(findRegion(stripChrome(html), preferClass));
}

function categoryFromBody(html: string): string | undefined {
  const m = /class="[^"]*\bcategory-([a-z0-9-]+)\b/i.exec(
    /<body[^>]*>/i.exec(html)?.[0] ?? "",
  );
  return m?.[1];
}

function classify(bodyTag: string, path: string): string | null {
  const c = bodyTag;
  if (path.startsWith("product/")) return "product";
  if (path.startsWith("event/")) return "event";
  if (path.startsWith("trainer/")) return "trainer";
  if (/\barchive\b|\bblog\b|search|author|post-type-archive|-page\/\d/.test(path)) return null;
  if (/single-product/.test(c)) return "product";
  if (/single-events|single-event\b/.test(c)) return "event";
  if (/single-class\b/.test(c)) return "class";
  if (/single-post|single-format/.test(c)) return "post";
  if (/page-template|(\bpage\b.*page-id)/.test(c)) return "page";
  return null;
}

// listing/system slugs that are never content
const SKIP = new Set([
  "blog", "classes", "egitimler", "etkinlikler", "magaza", "en", "product",
  "event", "trainer", "author", "product-category", "en-blog",
]);

function walk(dir: string, base = ""): { path: string; file: string }[] {
  const out: { path: string; file: string }[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      out.push(...walk(full, rel));
    } else if (entry.name === "index-https.html" || entry.name === "index.html") {
      out.push({ path: base, file: full });
    }
  }
  return out;
}

// ---------- main ----------

const pages = walk(CACHE_ROOT).filter(
  (p, i, arr) =>
    // dedupe dir (prefer index-https over index)
    arr.findIndex((q) => q.path === p.path) === i || p.file.includes("index-https"),
);
const seen = new Set<string>();
const items: Item[] = [];

for (const { path, file } of pages) {
  if (seen.has(path)) continue;
  seen.add(path);
  if (!path || path === "en") continue;
  const topSlug = path.split("/").pop() || path;
  if (SKIP.has(path) || SKIP.has(topSlug)) continue;
  if (/\/page\/\d+/.test(path) || path.startsWith("author") || path.startsWith("en/author")) continue;

  const html = readFileSync(file, "utf8");
  const bodyTag = /<body[^>]*>/i.exec(html)?.[0] ?? "";
  const type = classify(bodyTag, path);
  if (!type) continue;

  const lang = path.startsWith("en/") || /(^|\/)en-|-en$/.test(path) ? "en" : "tr";
  const slug = topSlug.replace(/^en-/, "").replace(/-en$/, "");
  // event/class titles carry a "/ Eğitim" price-type suffix — drop it
  const t = title(html).replace(/\s*\/\s*(Eğitim|Etkinlik|Workshop|Event)\s*$/i, "").trim();
  if (!t) continue;

  const base: Item = { slug, type, lang, title: t };

  if (type === "product") {
    const { body, excerpt } = bodyHtml(html, "wc-tab");
    Object.assign(base, {
      priceCents: priceCents(html),
      image: featuredImage(html),
      body,
      excerpt,
      category: categoryFromBody(html),
    });
  } else if (type === "event") {
    const { body, excerpt } = bodyHtml(html);
    Object.assign(base, { image: featuredImage(html), body, excerpt });
  } else if (type === "trainer") {
    const { body } = bodyHtml(html);
    Object.assign(base, { image: featuredImage(html), bio: body });
  } else {
    // post / page
    const { body, excerpt } = bodyHtml(html);
    Object.assign(base, {
      image: featuredImage(html),
      body,
      excerpt,
      category: type === "post" ? categoryFromBody(html) : undefined,
    });
  }

  items.push(base);
}

// Drop helix "class" items that duplicate an event (same title) — ambiguous Polylang/permalink dupes.
const eventTitles = new Set(items.filter((i) => i.type === "event").map((i) => i.title));
for (let i = items.length - 1; i >= 0; i--) {
  if (items[i].type === "class" && eventTitles.has(items[i].title as string)) items.splice(i, 1);
}

const summary = items.reduce<Record<string, number>>((acc, i) => {
  const key = `${i.type}:${i.lang}`;
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {});

writeFileSync(
  join(process.cwd(), "scripts/extracted-content.json"),
  JSON.stringify({ summary, count: items.length, items }, null, 2),
  "utf8",
);

console.log("Extracted", items.length, "items");
console.log("By type/lang:", summary);
console.log("Images copied:", copiedImages.size);
