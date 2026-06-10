import { prisma } from './prisma';
import { ApiError } from './api-helpers';

export const serializeCoupon = (c: {
  id: string; code: string; type: string; value: unknown; minOrderAmount: unknown;
  maxUses: number | null; usedCount: number; expiresAt: Date | null; isActive: boolean;
  createdAt: Date;
}) => ({
  id: c.id,
  code: c.code,
  type: c.type,
  value: Number(c.value),
  minOrderAmount: c.minOrderAmount != null ? Number(c.minOrderAmount) : null,
  maxUses: c.maxUses,
  usedCount: c.usedCount,
  expiresAt: c.expiresAt?.toISOString() ?? null,
  isActive: c.isActive,
  createdAt: c.createdAt.toISOString(),
});

/** Validate a coupon against a subtotal. Throws ApiError with a human reason.
    Returns the coupon row and the computed discount (never exceeds subtotal). */
export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase().trim() } });
  if (!coupon || !coupon.isActive) throw new ApiError(404, 'Invalid coupon code');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new ApiError(400, 'This coupon has expired');
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    throw new ApiError(400, 'This coupon has reached its usage limit');
  }
  const min = coupon.minOrderAmount != null ? Number(coupon.minOrderAmount) : 0;
  if (subtotal < min) {
    throw new ApiError(400, `Minimum order amount for this coupon is ₹${min.toFixed(0)}`);
  }
  const value = Number(coupon.value);
  const discount =
    coupon.type === 'PERCENT'
      ? Math.round(((subtotal * value) / 100) * 100) / 100
      : Math.min(value, subtotal);
  return { coupon, discount: Math.min(discount, subtotal) };
}
