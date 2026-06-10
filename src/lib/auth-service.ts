import { prisma } from './prisma';

const OTP_TTL_MS = 5 * 60 * 1000;

/** Same normalization as the old AuthService: strip separators, default +91 (India). */
export function normalizePhone(phone: string): string {
  let n = phone.replace(/[\s\-()]/g, '');
  if (!n.startsWith('+') && !/^\d{10,}$/.test(n)) n = '+91' + n;
  return n;
}

/** Create a cart for a user if one doesn't exist (mirrors createCartForUser). */
export async function ensureCart(userId: string): Promise<void> {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (!existing) {
    await prisma.cart.create({ data: { userId } }).catch(() => {});
  }
}

// ── OTP store (Supabase table; replaces in-memory Caffeine cache) ────────────

export async function generateAndStoreOtp(phone: string): Promise<string> {
  const code = String(100000 + Math.floor(Math.random() * 900000));
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  await prisma.otpCode.upsert({
    where: { phone },
    create: { phone, code, expiresAt },
    update: { code, expiresAt },
  });
  // No SMS provider wired (matches old mock). Log for dev visibility.
  console.log(`[otp] ${phone}: ${code}`);
  return code;
}

/** Verify an OTP and consume it (single-use), like the old CacheEvict behavior. */
export async function verifyOtp(phone: string, otp: string): Promise<boolean> {
  const row = await prisma.otpCode.findUnique({ where: { phone } });
  if (!row) return false;
  await prisma.otpCode.delete({ where: { phone } }).catch(() => {});
  if (row.expiresAt.getTime() < Date.now()) return false;
  return row.code === otp;
}
