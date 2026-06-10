import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/server-auth';
import { ApiError, json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { serializeCoupon } from '@/lib/coupons';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// PUT /coupons/{id} — admin: update fields (commonly isActive toggle).
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');
  const { id } = await params;
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);

  const b = await req.json();
  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      value: b.value != null ? Number(b.value) : undefined,
      minOrderAmount: b.minOrderAmount !== undefined ? (b.minOrderAmount != null ? Number(b.minOrderAmount) : null) : undefined,
      maxUses: b.maxUses !== undefined ? (b.maxUses != null ? Number(b.maxUses) : null) : undefined,
      expiresAt: b.expiresAt !== undefined ? (b.expiresAt ? new Date(b.expiresAt) : null) : undefined,
      isActive: b.isActive !== undefined ? Boolean(b.isActive) : undefined,
    },
  });
  return json(serializeCoupon(coupon));
});

// DELETE /coupons/{id} — admin.
export const DELETE = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');
  const { id } = await params;
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);
  await prisma.coupon.delete({ where: { id } });
  return json({ message: 'Coupon deleted' });
});
