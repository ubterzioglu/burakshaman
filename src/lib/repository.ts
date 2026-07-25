import { events, posts, products, staticPages, trainer } from "@/lib/content";
import { getDb, hasDatabase } from "@/lib/db";

export type EventView = {
  slug: string;
  title: string;
  date: string | null;
  location: string;
  description: string;
  body: string;
  image: string;
};

export type TrainerView = {
  slug: string;
  name: string;
  job: string | null;
  bio: string;
  image: string | null;
};

type SiteProduct = (typeof products)[number];
type SitePost = (typeof posts)[number];
type SitePage = (typeof staticPages)[number];
type DbProduct = {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  image: string | null;
  digital: boolean;
  category: { name: string } | null;
};
type DbPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string | null;
};
type DbEvent = {
  slug: string;
  title: string;
  startsAt: Date | null;
  location: string | null;
  description: string;
  body: string | null;
  image: string | null;
};
type DbTrainer = {
  slug: string;
  name: string;
  job: string | null;
  bio: string | null;
  avatar: string | null;
};
type DbPage = {
  slug: string;
  title: string;
  body: string;
};

export async function listProducts(): Promise<SiteProduct[]> {
  if (!hasDatabase()) return products;
  try {
    const dbProducts = await getDb().product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return dbProducts.map((product: DbProduct) => ({
      slug: product.slug,
      name: product.name,
      category: product.category?.name ?? "Products",
      priceCents: product.priceCents,
      description: product.description,
      image: product.image ?? "/assets/hcd.jpg",
      digital: product.digital,
    }));
  } catch {
    return products;
  }
}

export async function getProduct(slug: string): Promise<SiteProduct | undefined> {
  return (await listProducts()).find((product) => product.slug === slug);
}

export async function listPosts(): Promise<SitePost[]> {
  if (!hasDatabase()) return posts;
  try {
    const dbPosts = await getDb().post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return dbPosts.map((post: DbPost) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      image: post.image ?? "/assets/hcd.jpg",
    }));
  } catch {
    return posts;
  }
}

export async function getPost(slug: string): Promise<SitePost | undefined> {
  return (await listPosts()).find((post) => post.slug === slug);
}

export async function listEvents(): Promise<EventView[]> {
  if (!hasDatabase()) return events;
  try {
    const dbEvents = await getDb().event.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ startsAt: "asc" }, { createdAt: "desc" }],
    });
    return dbEvents.map((event: DbEvent) => ({
      slug: event.slug,
      title: event.title,
      date: event.startsAt?.toISOString().slice(0, 10) ?? null,
      location: event.location ?? "İstanbul / Online",
      description: event.description,
      body: event.body ?? "",
      image: event.image ?? "/assets/hcd.jpg",
    }));
  } catch {
    return events;
  }
}

export async function getEvent(slug: string): Promise<EventView | undefined> {
  return (await listEvents()).find((event) => event.slug === slug);
}

export async function listTrainers(): Promise<TrainerView[]> {
  if (!hasDatabase()) return trainer ? [{ ...trainer, job: null, bio: trainer.bio, image: trainer.image ?? null }] : [];
  try {
    const dbTrainers = await getDb().trainer.findMany({ orderBy: { name: "asc" } });
    return dbTrainers.map((t: DbTrainer) => ({
      slug: t.slug,
      name: t.name,
      job: t.job,
      bio: t.bio ?? "",
      image: t.avatar,
    }));
  } catch {
    return trainer ? [{ slug: trainer.slug, name: trainer.name, job: null, bio: trainer.bio, image: trainer.image ?? null }] : [];
  }
}

export async function getTrainer(slug: string): Promise<TrainerView | undefined> {
  return (await listTrainers()).find((t) => t.slug === slug);
}

export async function listPages(): Promise<SitePage[]> {
  if (!hasDatabase()) return staticPages;
  try {
    const dbPages = await getDb().page.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { title: "asc" },
    });
    return dbPages.map((page: DbPage) => ({
      slug: page.slug,
      title: page.title,
      body: page.body,
    }));
  } catch {
    return staticPages;
  }
}

export async function getPage(slug: string): Promise<SitePage | undefined> {
  return (await listPages()).find((page) => page.slug === slug);
}
