# Backend migration: Spring Boot (EC2) → Next.js API routes (Vercel) + Supabase

The Java backend has been reimplemented as Next.js route handlers living in this
same app under `src/app/api/backend/**`, backed by Supabase Postgres via Prisma.
The frontend is unchanged — it still calls `/api/backend/*`, which now resolves to
these route handlers instead of the old EC2 proxy.

## What changed

| Area | Before | Now |
|------|--------|-----|
| Backend | Spring Boot on EC2 (`http://65.2.121.137/api`) | Next.js route handlers, `src/app/api/backend/**` |
| DB access | JPA/Hibernate + Postgres on EC2 | Prisma 6 + Supabase Postgres |
| Auth | jBCrypt + jjwt (HS256) | `bcryptjs` + `jsonwebtoken` (HS256, **same secret** → old tokens stay valid) |
| OTP store | in-memory Caffeine cache | `otp_codes` table (serverless has no shared memory) |
| Email | Spring async JavaMail | `nodemailer` (awaited — serverless can't run work after the response) |
| Payments | Razorpay Java SDK | `razorpay` npm SDK + HMAC signature verify |
| Proxy | `api/backend/[...path]/route.ts` → EC2 | **deleted** |

Endpoints reproduced 1:1 (72 handlers across 13 controllers). **Not** ported:
`/api/logs/*` (read server log files — irrelevant on serverless) and the unused
`MarketplaceService` stubs (no controller ever exposed them).

`POST /auth/google` is now **fully implemented** (the old backend left it as a
501 TODO). It verifies the incoming `idToken` server-side — accepting either a
Firebase ID token (via Firebase Admin, already configured) or a raw Google OAuth
ID token (via `google-auth-library` against `GOOGLE_CLIENT_ID`) — then
links/creates the user and issues a JWT, matching the original upsert logic.

## One-time setup

### 1. Supabase connection strings
Supabase Dashboard → **Project Settings → Database → Connection string**. Copy two:

- **Pooler** (Transaction mode, port `6543`) → `DATABASE_URL`. Append
  `?pgbouncer=true&connection_limit=1`. Used at runtime — Vercel opens many
  short-lived connections; the pooler keeps real DB connections low.
- **Direct** (port `5432`) → `DIRECT_URL`. Used only by `prisma db pull` / migrations.

Put both in `.env` (local) and in Vercel env vars (prod). The placeholders are in `.env`.

### 2. Create the OTP table
Run `prisma/otp_table.sql` in the Supabase SQL editor (or `npx prisma db push`).

### 3. Verify the schema matches the migrated DB
The Prisma schema was hand-authored to match the old JPA entities. Reconcile it
against your live Supabase DB once:

```bash
npm run db:pull   # prisma db pull (via DIRECT_URL) + prisma generate
```

If `db pull` reports differences, eyeball them — column names should already match
(Hibernate used snake_case). The three element-collection tables
(`product_images`, `product_scent_notes`, `product_ingredients`) have no primary
key, so Prisma marks them `@@ignore` — that's expected; they're handled via raw SQL
in `src/lib/product-arrays.ts`. Confirm `gen_random_uuid()` is available
(`CREATE EXTENSION IF NOT EXISTS pgcrypto;` — already present on Supabase).

### 4. Local run
```bash
npm install        # runs prisma generate (postinstall)
npm run dev        # http://localhost:9002
```

## Vercel env vars (Project → Settings → Environment Variables)

```
DATABASE_URL            postgresql://postgres.<ref>:<pw>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL              postgresql://postgres:<pw>@db.<ref>.supabase.co:5432/postgres
JWT_SECRET              <same value the old Spring backend used, then rotate>
JWT_EXPIRATION_MS       86400000
RAZORPAY_KEY_ID         <razorpay key id>
RAZORPAY_KEY_SECRET     <razorpay key secret>     # server-only, never NEXT_PUBLIC_
NEXT_PUBLIC_RAZORPAY_KEY_ID  <razorpay key id>    # already used client-side
SMTP_HOST               smtp.gmail.com
SMTP_PORT               587
SMTP_USER               <gmail address>
SMTP_PASSWORD           <gmail app password>
MAIL_TO                 studiokraftika@gmail.com
MAIL_CC                 <optional>
CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET   # for image upload
NEXT_PUBLIC_FIREBASE_*  # unchanged
FIREBASE_PROJECT_ID / FIREBASE_PRIVATE_KEY / FIREBASE_CLIENT_EMAIL ... # Firebase Admin — needed for Google sign-in via Firebase ID tokens
GOOGLE_CLIENT_ID        # only if you send RAW Google ID tokens (Google Identity Services) instead of Firebase ones

```

`prisma generate` runs automatically on Vercel via the `postinstall` script (the
generated client in `src/generated/prisma` is gitignored).

## ⚠️ Rotate exposed secrets

These were committed in plaintext in the old `application.yml` and are compromised.
Rotate all of them, then set the new values only in Vercel env vars:

- Supabase DB password
- Razorpay `key-secret` (`bLt0L4sy6lj68oNauqxpB0Hl`)
- Gmail app password (`smeczzqvekqjsoue`)
- `JWT_SECRET` (rotating it logs everyone out once — acceptable)

## Decommission

Once Vercel is verified working against Supabase:
- Terminate the EC2 instance and its Postgres.
- The `kraftika-backend/` Java project is no longer deployed (keep it for reference or archive).
