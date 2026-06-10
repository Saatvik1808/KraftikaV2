import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/server-auth';
import { ApiError, json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { getOrder, toEmailData } from '@/lib/order-service';
import { orderResponse } from '@/lib/serializers';
import { sendOrderShipped } from '@/lib/order-emails';
import { notifyOrderShipped } from '@/lib/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// PUT /orders/{id}/shipment — admin only.
// Body: { trackingNumber, courierName?, trackingUrl?, notify? (default true) }
// Sets tracking info, marks the order SHIPPED, emails the customer.
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');

  const { id } = await params;
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);

  const body = await req.json();
  if (!body.trackingNumber) throw new ApiError(400, 'trackingNumber is required');

  await prisma.order.update({
    where: { id },
    data: {
      trackingNumber: body.trackingNumber,
      courierName: body.courierName ?? null,
      trackingUrl: body.trackingUrl ?? null,
      status: 'SHIPPED',
      shippedAt: existing.shippedAt ?? new Date(),
    },
  });

  const order = (await getOrder(id))!;

  if (body.notify !== false) {
    try {
      await sendOrderShipped(toEmailData(order));
    } catch (e) {
      console.error('[shipment] email failed:', e);
    }
    try {
      await notifyOrderShipped(order.user?.phone ?? null, order.id, order.trackingNumber, order.courierName);
    } catch (e) {
      console.error('[shipment] whatsapp failed:', e);
    }
  }

  return json(orderResponse(order));
});
