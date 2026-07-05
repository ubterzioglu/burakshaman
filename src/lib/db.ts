import { PrismaClient } from "@prisma/client";
import { applyDatabaseUrl } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function hasDatabase() {
  return Boolean(applyDatabaseUrl());
}

export function getDb() {
  if (!applyDatabaseUrl()) {
    throw new Error("DATABASE_URL is required for database-backed actions.");
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
}
