import { NextRequest } from 'next/server';
import { getAuth } from '@/lib/server-auth';
import { ApiError, json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { updateOrderStatus, getOrder, toEmailData } from '@/lib/order-service';
import { orderResponse } from '@/lib/serializers';
import { sendOrderShipped, sendOrderDelivered, sendOrderCancelled } from '@/lib/order-emails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

type Ctx = { params: Promise<{ id: string }> };

// PUT /orders/{id}/status?status=
// Admin sets any status. A customer may only CANCEL their own PENDING order.
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required');

  const { id } = await params;
  const status = (req.nextUrl.searchParams.get('status') ?? '').toUpperCase();
  if (!VALID.includes(status)) return errorJson(`Invalid status: ${status}`, 400);

  if (auth.role !== 'ADMIN') {
    const existing = await getOrder(id);
    if (!existing || existing.userId !== auth.userId) return errorJson('Not found', 404);
    if (status !== 'CANCELLED' || existing.status !== 'PENDING') {
      throw new ApiError(403, 'You can only cancel an order that is still pending');
    }
  }

  const order = await updateOrderStatus(id, status);
  if (!order) return errorJson('Not found', 404);

  // Status notification emails — best-effort.
  try {
    const data = toEmailData(order);
    if (status === 'SHIPPED') await sendOrderShipped(data);
    else if (status === 'DELIVERED') await sendOrderDelivered(data);
    else if (status === 'CANCELLED') await sendOrderCancelled(data);
  } catch (e) {
    console.error('[orders] status email failed:', e);
  }

  return json(orderResponse(order));
});
