import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { hash } from "bcryptjs";
import { staticPages } from "../src/lib/content";
import {
  realProducts,
  realPosts,
  realEvents,
  realTrainer,
} from "../src/lib/content-data";
import { getAdminPassword } from "../src/lib/admin-password";
import { applyDatabaseUrl } from "../src/lib/env";

// Lightweight .env loader (avoids a hard dependency on @next/env for the seed script).
function loadEnvFiles() {
  for (const file of [".env", ".env.local"]) {
    try {
      const content = readFileSync(resolve(process.cwd(), file), "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = value;
      }
    } catch {
      // file missing — ignore
    }
  }
}

loadEnvFiles();
applyDatabaseUrl();
const prisma = new PrismaClient();

function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[çğıöşü]/g, (c) => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" })[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  for (const product of realProducts) {
    const category = await prisma.category.upsert({
      where: { slug: categorySlug(product.category) },
      create: { slug: categorySlug(product.category), name: product.category },
      update: { name: product.category },
    });

    const data = {
      name: product.name,
      nameEn: product.nameEn ?? null,
      description: product.description,
      descriptionEn: product.descriptionEn ?? null,
      priceCents: product.priceCents,
      image: product.image ?? null,
      digital: product.digital,
      categoryId: category.id,
    };
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: { slug: product.slug, ...data },
      update: data,
    });
  }

  for (const post of realPosts) {
    const data = {
      title: post.title,
      titleEn: post.titleEn ?? null,
      excerpt: post.excerpt,
      excerptEn: post.excerptEn ?? null,
      body: post.body,
      bodyEn: post.bodyEn ?? null,
      image: post.image ?? null,
    };
    await prisma.post.upsert({
      where: { slug: post.slug },
      create: { slug: post.slug, publishedAt: new Date(), ...data },
      update: data,
    });
  }

  for (const page of staticPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      create: { slug: page.slug, title: page.title, body: page.body },
      update: { title: page.title, body: page.body },
    });
  }

  for (const event of realEvents) {
    const data = {
      title: event.title,
      description: event.description,
      body: event.body ?? null,
      image: event.image ?? null,
      location: "İstanbul / Online",
    };
    await prisma.event.upsert({
      where: { slug: event.slug },
      create: { slug: event.slug, ...data },
      update: data,
    });
  }

  if (realTrainer) {
    const data = {
      name: realTrainer.name,
      bio: realTrainer.bio || null,
      bioEn: realTrainer.bioEn ?? null,
      avatar: realTrainer.image ?? null,
    };
    await prisma.trainer.upsert({
      where: { slug: realTrainer.slug },
      create: { slug: realTrainer.slug, ...data },
      update: data,
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@shamanlife.local";
  const adminPassword = getAdminPassword();
  if (adminPassword) {
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


