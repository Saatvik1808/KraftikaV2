import { NextRequest } from 'next/server';
import { getUserId } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { listOrders, createOrder } from '@/lib/order-service';
import { orderResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /orders?userId= — orders for a user (defaults to the authenticated user).
export const GET = withErrorHandling(async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get('userId') ?? getUserId(req);
  const orders = await listOrders(userId);
  return json(orders.map(orderResponse));
});

// POST /orders — create an order (auth required).
export const POST = withErrorHandling(async (req: NextRequest) => {
  const userId = getUserId(req);
  if (!userId) throw new ApiError(401, 'Authentication required. Please login to create an order.');
  const body = await req.json();
  const order = await createOrder(userId, body);
  return json(orderResponse(order));
});
