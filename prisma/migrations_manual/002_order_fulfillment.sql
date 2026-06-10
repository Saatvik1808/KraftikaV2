-- Order fulfillment columns: payment linkage + shipment tracking + lifecycle timestamps.
-- Applied to Supabase via script; kept here as the source of record.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_id      VARCHAR(255),
  ADD COLUMN IF NOT EXISTS paid_at         TIMESTAMP,
  ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255),
  ADD COLUMN IF NOT EXISTS courier_name    VARCHAR(255),
  ADD COLUMN IF NOT EXISTS tracking_url    TEXT,
  ADD COLUMN IF NOT EXISTS shipped_at      TIMESTAMP,
  ADD COLUMN IF NOT EXISTS delivered_at    TIMESTAMP,
  ADD COLUMN IF NOT EXISTS cancelled_at    TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
