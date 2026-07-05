# Shaman Life Next.js

Full-stack Next.js rebuild of the Shaman Life / Burak Akcakanat WordPress site.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- PostgreSQL with Prisma
- PayTR iFrame checkout
- Custom booking, contact, newsletter, account and admin foundations
- Coolify-ready Docker deployment

## Local setup

```bash
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:migrate
pnpm db:seed
pnpm build
pnpm dev
```

Database-backed forms require `DATABASE_URL`. For Supabase, set `DATABASE_URL`
to the Supabase Postgres connection string, not the public API URL or anon key.
At runtime the app also accepts `SUPABASE_DATABASE_URL`, `POSTGRES_PRISMA_URL`,
or `POSTGRES_URL`, but Prisma migrations are simplest when `DATABASE_URL` is set.
PayTR checkout requires `PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`,
`PAYTR_MERCHANT_SALT`, and `APP_URL`.

Set one admin password variable before deploy: `ADMIN_PASSWORD`, `ADMIN_PASS`,
or `ADMIN_PANEL_PASSWORD`. `/admin/login` uses only this password, without an
email field. On first successful admin login the app creates or updates the
admin user with the `ADMIN` role. `ADMIN_EMAIL` is optional and only sets the
stored admin email; otherwise `admin@shamanlife.local` is used.

## Coolify

1. Create a PostgreSQL resource.
2. Set the environment variables from `.env.example`.
3. Deploy using the included `Dockerfile`.
4. Run `pnpm prisma:migrate` or the equivalent one-off command before accepting live orders.

## Source migration notes

The legacy WordPress files under `public_html/` are intentionally ignored and are
not committed. Public content was rebuilt from the local theme/cache/assets and
the current visible site. Historical users, orders and reservations require a
WordPress database dump if they need to be migrated later.
