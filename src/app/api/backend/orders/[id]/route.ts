import { NextRequest } from 'next/server';
import { getAuth } from '@/lib/server-auth';
import { ApiError, json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { getOrder } from '@/lib/order-service';
import { orderResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET /orders/{id} — owner or admin only.
export const GET = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required');

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return errorJson('Not found', 404);
  if (auth.role !== 'ADMIN' && order.userId !== auth.userId) {
    return errorJson('Not found', 404); // don't reveal existence of others' orders
  }
  return json(orderResponse(order));
});
