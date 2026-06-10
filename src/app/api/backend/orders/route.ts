import { NextRequest } from 'next/server';
import { getAuth } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { listOrders, createOrder, toEmailData } from '@/lib/order-service';
import { orderResponse } from '@/lib/serializers';
import { sendOrderConfirmation } from '@/lib/order-emails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /orders?userId=&page=&limit=
// Security: a customer only ever sees their own orders. The userId query param
// is honored only for admins (the old backend leaked all orders unauthenticated).
export const GET = withErrorHandling(async (req: NextRequest) => {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required');

  const requestedUserId = req.nextUrl.searchParams.get('userId');
  const userId =
    auth.role === 'ADMIN' ? (requestedUserId || null) : auth.userId;

  const page = Math.max(1, Number(req.nextUrl.searchParams.get('page') ?? '1') || 1);
  const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get('limit') ?? '50') || 50));

  const orders = await listOrders(userId, { skip: (page - 1) * limit, take: limit });
  return json(orders.map(orderResponse));
});

// POST /orders — create order (auth required) + send confirmation email.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required. Please login to create an order.');

  const body = await req.json();
  const order = await createOrder(auth.userId, body);

  try {
    await sendOrderConfirmation(toEmailData(order));
  } catch (e) {
    console.error('[orders] confirmation email failed:', e);
  }

  return json(orderResponse(order));
});
