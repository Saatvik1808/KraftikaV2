-- Commerce features: address book, product reviews, returns, coupons.
-- Applied to Supabase via script. Source of record for these tables.

CREATE TABLE IF NOT EXISTS user_addresses (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label       VARCHAR(50),
    full_name   VARCHAR(200),
    phone       VARCHAR(32),
    street      TEXT NOT NULL,
    city        VARCHAR(120) NOT NULL,
    state       VARCHAR(120) NOT NULL,
    zip_code    VARCHAR(20) NOT NULL,
    country     VARCHAR(120) NOT NULL DEFAULT 'India',
    is_default  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON user_addresses(user_id);

CREATE TABLE IF NOT EXISTS product_reviews (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id         UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating             INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title              VARCHAR(200),
    comment            TEXT,
    verified_purchase  BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved        BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON product_reviews(product_id, is_approved);

CREATE TABLE IF NOT EXISTS return_requests (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason         TEXT NOT NULL,
    status         VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING/APPROVED/REJECTED/REFUNDED
    admin_note     TEXT,
    refund_amount  DECIMAL(10,2),
    resolved_at    TIMESTAMP,
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (order_id)
);
CREATE INDEX IF NOT EXISTS idx_returns_user ON return_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON return_requests(status);

CREATE TABLE IF NOT EXISTS coupons (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code              VARCHAR(40) NOT NULL UNIQUE,
    type              VARCHAR(10) NOT NULL DEFAULT 'PERCENT', -- PERCENT / FIXED
    value             DECIMAL(10,2) NOT NULL,
    min_order_amount  DECIMAL(10,2),
    max_uses          INTEGER,
    used_count        INTEGER NOT NULL DEFAULT 0,
    expires_at        TIMESTAMP,
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS coupon_code     VARCHAR(40),
  ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2)
