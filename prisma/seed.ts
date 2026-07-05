import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { events, posts, products, staticPages } from "../src/lib/content";

const prisma = new PrismaClient();

async function main() {
  const categoryMap = new Map<string, string>();

  for (const product of products) {
    const category = await prisma.category.upsert({
      where: { slug: product.category.toLowerCase().replaceAll(" ", "-") },
      create: {
        slug: product.category.toLowerCase().replaceAll(" ", "-"),
        name: product.category,
      },
      update: { name: product.category },
    });
    categoryMap.set(product.category, category.id);

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        image: product.image,
        digital: product.digital,
        categoryId: category.id,
      },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        image: product.image,
        digital: product.digital,
        categoryId: category.id,
      },
    });
  }

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        image: post.image,
        publishedAt: new Date(),
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        body: post.body,
        image: post.image,
      },
    });
  }

  for (const page of staticPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      create: page,
      update: { title: page.title, body: page.body },
    });
  }

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      create: {
        slug: event.slug,
        title: event.title,
        description: event.description,
        startsAt: event.date ? new Date(event.date) : null,
        location: event.location,
      },
      update: {
        title: event.title,
        description: event.description,
        startsAt: event.date ? new Date(event.date) : null,
        location: event.location,
      },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      create: {
        email: adminEmail.toLowerCase(),
        name: "Shaman Life Admin",
        role: "ADMIN",
        passwordHash: await hash(adminPassword, 12),
      },
      update: {
        role: "ADMIN",
        passwordHash: await hash(adminPassword, 12),
      },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
