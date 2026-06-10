import { NextRequest } from 'next/server';
import { getAuth } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { validateCoupon } from '@/lib/coupons';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /coupons/validate — { code, subtotal } -> { code, discount, type, value }
export const POST = withErrorHandling(async (req: NextRequest) => {
  if (!getAuth(req)) throw new ApiError(401, 'Authentication required');
  const { code, subtotal } = await req.json();
  if (!code || typeof subtotal !== 'number') throw new ApiError(400, 'code and subtotal are required');
  const { coupon, discount } = await validateCoupon(code, subtotal);
  return json({
    code: coupon.code,
    type: coupon.type,
    value: Number(coupon.value),
    discount,
    finalAmount: Math.max(0, Math.round((subtotal - discount) * 100) / 100),
  });
});
