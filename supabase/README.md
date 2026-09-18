# Supabase database launch

Run the SQL files in filename order:

1. `migrations/0001_service_categories.sql`
2. `migrations/0002_launch_schema_and_seed.sql`

For a new Supabase project, open **SQL Editor**, paste the complete contents of the first file, run it, then repeat with the second file. Both migrations are idempotent for the launch schema and seed records.

The second migration creates the inventory, paint-formula, estimate-request, contact-request, and site-settings tables. It also inserts the public business settings and the initial website service categories. It intentionally does not create fictional customers, estimates, or inventory items.

After running both files, use Supabase **Connect → Transaction pooler** to obtain the `DATABASE_URL` for Vercel.

To verify the launch schema from a computer with `psql`, set `DATABASE_URL` and run `npm run db:verify`. The verification fails if a required table, the four primary service categories, or the business-name setting is missing.
