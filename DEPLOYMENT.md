# Deploying to Supabase and Vercel

You need: a GitHub account, a Supabase account, a Vercel account, access to the DNS for autoandallautomotive.com, and the details of your own SMTP server.

## 1. Put the code on GitHub
1. In the project folder run `git init`, then `git add -A` and `git commit -m "Initial commit"`. Check `git status` first: `.env`, `node_modules` and `.next` must not be listed (`.env.example` should be).
2. Create a new **private** repository on GitHub and push: `git remote add origin <url>`, `git branch -M main`, `git push -u origin main`.

## 2. Create the Supabase database
3. supabase.com → **New project**. Pick the region closest to your Vercel functions (for North Carolina, `us-east`), and set a strong database password. Save it.
4. Open **SQL Editor → New query**. Paste the whole of `supabase/migrations/0001_service_categories.sql`, click **Run**. Then paste and run `supabase/migrations/0002_launch_schema_and_seed.sql`. Both are safe to run again.
5. Open **Table Editor** and confirm: 6 tables, each marked "RLS enabled"; `service_categories` has 20 rows; `site_settings` has 4 rows. (Optional: run `supabase/verify_launch.sql` in the SQL Editor; it should print "launch verification passed".)
6. Click **Connect** → **Transaction pooler** → copy the URI. It looks like `postgresql://postgres.<project-ref>:[YOUR-PASSWORD]@aws-0-<region>.pooler.supabase.com:6543/postgres`. Replace `[YOUR-PASSWORD]` with your password. If the password contains special characters (`@ : / # ?`), URL-encode them. This is your `DATABASE_URL`.

## 3. Create the Vercel project
7. vercel.com → **Add New → Project** → import the GitHub repository. Framework: Next.js (auto-detected). Leave the build and install commands at their defaults.
8. Before deploying, open **Environment Variables** and add these (Production, and Preview if you want previews to work):

| Name | Value |
|---|---|
| `DATABASE_URL` | the transaction-pooler URI from step 6 |
| `ADMIN_PASSWORD` | a long random password (`openssl rand -base64 32`) |
| `SITE_URL` | `https://autoandallautomotive.com` (or the final address you'll use) |
| `SMTP_HOST` | your mail server's hostname |
| `SMTP_PORT` | `587` |
| `SMTP_USER` / `SMTP_PASS` | the SMTP login |
| `MAIL_FROM` | `Auto And All Automotive <estimates@autoandallautomotive.com>` |
| `ESTIMATE_TO_EMAIL` | `estimates@autoandallautomotive.com` |

   Leave `SMTP_SECURE=false`, `SMTP_REQUIRE_TLS=true` and `SMTP_TLS_REJECT_UNAUTHORIZED=true` unset (those are the defaults). Never prefix any of these with `NEXT_PUBLIC_`.
9. In **Settings → General**, set Node.js Version to 22.x, and under **Functions** set the region to match your Supabase region.
10. Click **Deploy**.

## 4. Point your domain at it
11. **Settings → Domains** → add `autoandallautomotive.com` and `www.autoandallautomotive.com`. Vercel shows the exact DNS records to create at your DNS provider (typically an `A` record for the bare domain and a `CNAME` for `www`). Choose which one is the primary and let the other redirect.
12. Make sure `SITE_URL` matches the primary address exactly, then **Redeploy** (env changes only apply to new deployments).

## 5. Prepare your SMTP server
13. Create the mailbox `estimates@autoandallautomotive.com` (where requests arrive) and an account the site logs in with.
14. The server must accept authenticated mail on port 587 with STARTTLS from any IP address (Vercel's addresses change, so you can't allow-list them), and its TLS certificate must be valid and match `SMTP_HOST`. Port 25 is blocked on Vercel.
15. Publish SPF, DKIM and DMARC records for autoandallautomotive.com so mail from `MAIL_FROM` isn't marked as spam.

## 6. Test the live site
16. Browse every page, on desktop and phone. Check `/robots.txt` and `/sitemap.xml`.
17. Go to `/admin`, sign in with `ADMIN_PASSWORD`, change a category's description, and confirm the homepage updates.
18. Send a test request from the form on `/contact` (attach a photo). It should arrive at `estimates@autoandallautomotive.com` with the photo attached, and replying should go to the sender.
19. If email fails, open Vercel **Logs** and search "Estimate email failed". `ETLS` = TLS problem, `EAUTH` = wrong login, `ECONNECTION`/`ETIMEDOUT` = the server can't be reached.

## 7. Search and social
20. Paste your URLs into the Facebook Sharing Debugger and click **Scrape Again**, so previews show the new images.
21. Add the site to Google Search Console and submit `https://<your-domain>/sitemap.xml`.

## Good to know
- **Parts inventory is browser-only.** `/parts-inventory` saves in each browser's local storage (with sample parts built in). Nothing is stored in Supabase, so it isn't shared between devices or people. The inventory tables in the database are ready but unused.
- **Estimate requests are emailed, not stored.** If the mail server is down when someone submits, the visitor is asked to email you instead and nothing is saved.
- **Preview deployments** use the same variables unless you scope them to Production only. Use a separate Supabase project for previews if you don't want them touching live data.
- **Schema changes:** add a new numbered file in `supabase/migrations/` and run it in the SQL Editor. Don't run `npm run db:generate`; the Drizzle schema file is out of date and unused.
- **Categories look empty after deploy?** The app must connect as Supabase's `postgres` user (which bypasses row-level security). Use the pooler URI from step 6, not an `anon` or custom role.
