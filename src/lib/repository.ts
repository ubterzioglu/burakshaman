import { events, posts, products, staticPages } from "@/lib/content";
import { getDb, hasDatabase } from "@/lib/db";

export async function listProducts() {
  if (!hasDatabase()) return products;
  try {
    const dbProducts = await getDb().product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return dbProducts.map((product) => ({
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

export async function getProduct(slug: string) {
  return (await listProducts()).find((product) => product.slug === slug);
}

export async function listPosts() {
  if (!hasDatabase()) return posts;
  try {
    const dbPosts = await getDb().post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return dbPosts.map((post) => ({
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

export async function getPost(slug: string) {
  return (await listPosts()).find((post) => post.slug === slug);
}

export async function listEvents() {
  if (!hasDatabase()) return events;
  try {
    const dbEvents = await getDb().event.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ startsAt: "asc" }, { createdAt: "desc" }],
    });
    return dbEvents.map((event) => ({
      slug: event.slug,
      title: event.title,
      date: event.startsAt?.toISOString().slice(0, 10) ?? null,
      location: event.location ?? "Online",
      description: event.description,
    }));
  } catch {
    return events;
  }
}

export async function listPages() {
  if (!hasDatabase()) return staticPages;
  try {
    const dbPages = await getDb().page.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { title: "asc" },
    });
    return dbPages.map((page) => ({
      slug: page.slug,
      title: page.title,
      body: page.body,
    }));
  } catch {
    return staticPages;
  }
}

export async function getPage(slug: string) {
  return (await listPages()).find((page) => page.slug === slug);
}
