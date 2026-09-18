# Auto And All Automotive — Next.js + Supabase

This package contains the complete Auto And All Automotive website, all image assets, a standard Next.js application for Vercel, and a PostgreSQL schema for Supabase.

## Architecture

- Website and API: Next.js App Router
- Production hosting: Vercel
- Production database: Supabase PostgreSQL
- Database access: Postgres.js with one serverless connection and prepared statements disabled
- Local development: Docker Compose with PostgreSQL 16
- Administrative access: password-protected `/admin` area using a secure HTTP-only cookie

## Local Docker setup

1. Copy `.env.example` to `.env` and replace the sample administrator password.
2. Run `docker compose up --build`.
3. Open `http://localhost:3000`.
4. Open `http://localhost:3000/admin` for the administrative dashboard.

The local PostgreSQL database is initialized automatically from every numbered SQL file in `supabase/migrations`. Its data is retained in the `auto_and_all_postgres_data` Docker volume.

Stop the system with `docker compose down`. To intentionally delete all local database data, use `docker compose down -v`.

## Create the Supabase database

1. Create a Supabase project.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the files in `supabase/migrations` in filename order: first `0001_service_categories.sql`, then `0002_launch_schema_and_seed.sql`.
4. Confirm that the service categories, launch settings, inventory, paint-formula, estimate-request, and contact-request tables appear in Table Editor.
5. In **Connect**, select the transaction pooler connection for a serverless application.
6. Copy that PostgreSQL URL and replace its password placeholder.

The migration enables Row Level Security and removes direct browser access. The website accesses the database only from its server-side Next.js API.

## Deploy to Vercel

1. Upload this project to a GitHub repository or import the project folder directly into Vercel.
2. Select the Next.js framework preset. The normal build command is `npm run build`.
3. Add these environment variables to Vercel for Production, Preview, and Development as appropriate:
   - `DATABASE_URL` — Supabase transaction-pooler PostgreSQL URL
   - `ADMIN_PASSWORD` — a long unique password for `/admin`
   - `SITE_URL` — the public address of the site (for example `https://autoandallautomotive.com`), used for canonical URLs, the sitemap and social preview images
4. Deploy the project.

Do not prefix either variable with `NEXT_PUBLIC_`; both values must remain server-only. Do not commit a real `.env` file.

## Estimate form email

The estimate form on `/contact` emails each request (the old `/estimate` address redirects there) to `estimates@autoandallautomotive.com` through an SMTP server you configure with environment variables (Docker reads them from `.env`; on Vercel add them under Environment Variables):

| Variable | Default | Purpose |
|---|---|---|
| `SMTP_HOST` | — (required) | SMTP server hostname |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_SECURE` | `false` | `true` = implicit TLS (use with port 465). With `false`, the connection is upgraded with STARTTLS. |
| `SMTP_REQUIRE_TLS` | `true` | Refuse to send unless the connection is encrypted |
| `SMTP_USER`, `SMTP_PASS` | — | SMTP login, if the server needs one |
| `MAIL_FROM` | `SMTP_USER` | The "From" address (many providers require it to match the login) |
| `ESTIMATE_TO_EMAIL` | `estimates@autoandallautomotive.com` | Where requests are sent |
| `SMTP_TLS_REJECT_UNAUTHORIZED` | `true` | Set `false` only for a local test server with a self-signed certificate |

Until `SMTP_HOST` is set, the form shows a friendly error and nothing is sent. When the customer gives an email address, replying to the message goes straight to them.

## Run without Docker

Requirements: Node.js 22.13 or later and access to PostgreSQL.

```bash
npm ci
npm run dev
```

## Project structure

- `app/(main)/` — the public website (home, body shop, custom paint, auto service, work, estimate, contact) with the shared header, footer and mobile menu
- `app/(admin)/admin/` — protected administrative dashboard and sign-in
- `app/(parts-inventory)/parts-inventory/` — the parts inventory tool
- `app/api/` — route handlers: `categories/` (category CRUD), `vin/` (VIN decoding), `admin/` (sign in and out)
- `components/layout/` — site header, navbar, mobile navbar and footer
- `components/home/`, `components/estimate/`, `components/admin/`, `components/parts-inventory/` — components for each area
- `components/ui/` — shadcn/ui primitives
- `common/db/` — server-side PostgreSQL connection and queries
- `common/hooks/`, `common/lib/` — shared hooks and utilities
- `supabase/migrations/` — PostgreSQL schema for Supabase and local Docker
- `public/` — logos, header images, photographs, and favicon

## Useful commands

- `npm run dev` — start the Next.js development server
- `npm run build` — create the Vercel-compatible production build
- `npm run start` — run the production build
- `npm run lint` — check source formatting and rules
- `npm run db:generate` — generate a new Drizzle PostgreSQL migration after schema changes
- `npm run db:migrate` — apply every numbered migration with `psql`
- `npm run db:verify` — confirm all launch tables and required seed records exist
