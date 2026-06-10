import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { verifyRazorpaySignature } from '@/lib/razorpay-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /payments/verify — { orderId, paymentId, signature, internalOrderId? } -> { valid }
// On a valid signature, links the payment to our order and confirms it.
// (There is no Razorpay webhook configured, so this is THE step that moves an
// order out of PENDING after an online payment.)
export const POST = withErrorHandling(async (req: NextRequest) => {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required');

  const { orderId, paymentId, signature, internalOrderId } = await req.json();
  const valid = verifyRazorpaySignature(orderId, paymentId, signature);

  if (valid && internalOrderId) {
    const order = await prisma.order.findUnique({ where: { id: internalOrderId } });
    // Only the order's owner (or an admin) may confirm it.
    if (order && (order.userId === auth.userId || auth.role === 'ADMIN')) {
      await prisma.order.update({
        where: { id: internalOrderId },
        data: {
          status: order.status === 'PENDING' ? 'CONFIRMED' : order.status,
          paymentId,
          paidAt: order.paidAt ?? new Date(),
          paymentMethod: 'RAZORPAY',
        },
      });
    }
  }

  return json({ valid });
});
