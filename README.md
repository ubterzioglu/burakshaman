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

Database-backed forms require `DATABASE_URL`. PayTR checkout requires
`PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT`, and `APP_URL`.
Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before `pnpm db:seed` to create the first
admin user.

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
