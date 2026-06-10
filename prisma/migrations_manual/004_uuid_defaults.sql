-- The old Hibernate backend generated UUIDs app-side, so 8 tables were created
-- without a DB default on id. Prisma relies on the DB default — inserts into
-- these tables failed with "Null constraint violation on (id)".
-- Applied to the live DB on 2026-06-10.
ALTER TABLE cart_items         ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE carts              ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE gst_invoice_items  ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE gst_invoices       ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE payouts            ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE vendor_order_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE vendor_orders      ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE vendors            ALTER COLUMN id SET DEFAULT gen_random_uuid();
