import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { vendorOrderResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID = ['SENT', 'PARTIALLY_SOLD', 'SOLD', 'RETURNED'];

type Ctx = { params: Promise<{ id: string }> };

// PUT /vendor-orders/{id}/status?status=
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const status = (req.nextUrl.searchParams.get('status') ?? '').toUpperCase();
  if (!VALID.includes(status)) return errorJson(`Invalid status: ${status}`, 400);

  const existing = await prisma.vendorOrder.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);

  const order = await prisma.vendorOrder.update({
    where: { id },
    data: { status, ...(status === 'SOLD' ? { soldDate: new Date() } : {}) },
    include: { vendor: true, orderItems: true },
  });
  return json(vendorOrderResponse(order));
});
