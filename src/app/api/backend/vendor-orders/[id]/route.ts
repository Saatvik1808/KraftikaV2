import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { vendorOrderResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET /vendor-orders/{id}
export const GET = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const order = await prisma.vendorOrder.findUnique({
    where: { id },
    include: { vendor: true, orderItems: true },
  });
  if (!order) return errorJson('Not found', 404);
  return json(vendorOrderResponse(order));
});

// DELETE /vendor-orders/{id}
export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const existing = await prisma.vendorOrder.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);
  await prisma.vendorOrder.delete({ where: { id } });
  return json({ message: 'Vendor order deleted successfully' });
});
