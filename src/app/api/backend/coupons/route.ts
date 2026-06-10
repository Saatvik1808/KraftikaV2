import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { serializeCoupon } from '@/lib/coupons';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /coupons — admin: list all.
export const GET = withErrorHandling(async (req: NextRequest) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  return json(coupons.map(serializeCoupon));
});

// POST /coupons — admin: create. { code, type, value, minOrderAmount?, maxUses?, expiresAt? }
export const POST = withErrorHandling(async (req: NextRequest) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');
  const b = await req.json();
  if (!b.code?.trim()) throw new ApiError(400, 'code is required');
  const type = (b.type ?? 'PERCENT').toUpperCase();
  if (!['PERCENT', 'FIXED'].includes(type)) throw new ApiError(400, 'type must be PERCENT or FIXED');
  const value = Number(b.value);
  if (!(value > 0)) throw new ApiError(400, 'value must be > 0');
  if (type === 'PERCENT' && value > 100) throw new ApiError(400, 'percent value cannot exceed 100');

  const code = b.code.toUpperCase().trim();
  const exists = await prisma.coupon.findUnique({ where: { code } });
  if (exists) throw new ApiError(409, 'Coupon code already exists');

  const coupon = await prisma.coupon.create({
    data: {
      code,
      type,
      value,
      minOrderAmount: b.minOrderAmount != null ? Number(b.minOrderAmount) : null,
      maxUses: b.maxUses != null ? Number(b.maxUses) : null,
      expiresAt: b.expiresAt ? new Date(b.expiresAt) : null,
      isActive: b.isActive !== false,
    },
  });
  return json(serializeCoupon(coupon), 201);
});
