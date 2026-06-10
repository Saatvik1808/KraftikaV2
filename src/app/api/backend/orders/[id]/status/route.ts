import { NextRequest } from 'next/server';
import { getUserId } from '@/lib/server-auth';
import { ApiError, json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { updateOrderStatus } from '@/lib/order-service';
import { orderResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

type Ctx = { params: Promise<{ id: string }> };

// PUT /orders/{id}/status?status= — auth required.
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  if (!getUserId(req)) throw new ApiError(401, 'Authentication required');
  const { id } = await params;
  const status = (req.nextUrl.searchParams.get('status') ?? '').toUpperCase();
  if (!VALID.includes(status)) return errorJson(`Invalid status: ${status}`, 400);

  const order = await updateOrderStatus(id, status);
  if (!order) return errorJson('Not found', 404);
  return json(orderResponse(order));
});
