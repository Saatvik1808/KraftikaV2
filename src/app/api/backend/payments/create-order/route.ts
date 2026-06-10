import { NextRequest } from 'next/server';
import { randomUUID } from 'crypto';
import { getUserId } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { createRazorpayOrder, razorpayKeyId } from '@/lib/razorpay-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /payments/create-order — { amount, currency?, receipt? } -> Razorpay order
export const POST = withErrorHandling(async (req: NextRequest) => {
  if (!getUserId(req)) throw new ApiError(401, 'Authentication required');
  const body = await req.json();

  const amount = Number(body.amount);
  if (!amount || Number.isNaN(amount)) throw new ApiError(400, 'amount is required');
  const currency = body.currency ?? 'INR';

  // Razorpay receipt must be <= 40 chars.
  let receipt = String(body.receipt ?? randomUUID());
  if (receipt.length > 40) {
    const cleaned = receipt.replace(/-/g, '');
    receipt = cleaned.length > 40 ? cleaned.slice(-40) : cleaned;
  }

  const notes = body.internalOrderId ? { internalOrderId: String(body.internalOrderId) } : undefined;
  const order = await createRazorpayOrder(amount, currency, receipt, notes);
  return json({
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    receipt: order.receipt,
    keyId: razorpayKeyId(),
  });
});
