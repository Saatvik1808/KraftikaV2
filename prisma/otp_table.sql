-- OTP store for phone auth. Replaces Spring's in-memory Caffeine cache, which
-- does not survive across serverless invocations on Vercel.
-- Run once in the Supabase SQL editor (or via `npx prisma db push`).

CREATE TABLE IF NOT EXISTS otp_codes (
    phone       VARCHAR(32) PRIMARY KEY,
    code        VARCHAR(10) NOT NULL,
    expires_at  TIMESTAMP   NOT NULL,
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);
