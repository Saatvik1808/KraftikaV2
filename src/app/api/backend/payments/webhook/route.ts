import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { json, errorJson, withErrorHandling } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /payments/webhook — Razorpay server-to-server payment events.
// Configure in Razorpay Dashboard → Settings → Webhooks:
//   URL:    https://www.kraftikastudio.com/api/backend/payments/webhook
//   Secret: set the same value as RAZORPAY_WEBHOOK_SECRET in Vercel
//   Events: payment.captured, payment.failed
//
// This is the reliable path: even if the customer's browser dies right after
// paying, the order still gets confirmed.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  if (!secret) return errorJson('Webhook not configured', 503);

  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  let valid = false;
  try {
    valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    valid = false;
  }
  if (!valid) return errorJson('Invalid signature', 400);

  const event = JSON.parse(body);
  const payment = event?.payload?.payment?.entity;

  if (event.event === 'payment.captured' && payment) {
    // Our checkout passes the internal order id as a note; receipt carries the
    // tail of the order UUID as fallback ("ord" + last 32 hex chars).
    const internalOrderId: string | undefined = payment.notes?.internalOrderId;
    let order = internalOrderId
      ? await prisma.order.findUnique({ where: { id: internalOrderId } })
      : null;

    if (!order && payment.order_id) {
      // Fallback: match by stored payment/receipt linkage if verify already ran.
      order = await prisma.order.findFirst({ where: { paymentId: payment.id } });
    }

    if (order && order.status === 'PENDING') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CONFIRMED',
          paymentId: payment.id,
          paidAt: order.paidAt ?? new Date(),
          paymentMethod: 'RAZORPAY',
        },
      });
      console.log('[webhook] order confirmed:', order.id, 'payment:', payment.id);
    }
  }

  if (event.event === 'payment.failed' && payment) {
    console.warn('[webhook] payment failed:', payment.id, payment.error_description);
  }

  return json({ received: true });
});
