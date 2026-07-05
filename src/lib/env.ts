const databaseUrlKeys = [
  "DATABASE_URL",
  "SUPABASE_DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "POSTGRES_URL_NON_POOLING",
];

export function resolveDatabaseUrl() {
  for (const key of databaseUrlKeys) {
    const value = process.env[key];
    if (value) return value;
  }
  return undefined;
}

export function applyDatabaseUrl() {
  const value = resolveDatabaseUrl();
  if (value && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = value;
  }
  return value;
}
