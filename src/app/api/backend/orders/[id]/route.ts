import { NextRequest } from 'next/server';
import { json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { getOrder } from '@/lib/order-service';
import { orderResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET /orders/{id}
export const GET = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return errorJson('Not found', 404);
  return json(orderResponse(order));
});
