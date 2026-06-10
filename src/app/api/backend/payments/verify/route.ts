import { NextRequest } from 'next/server';
import { getUserId } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { verifyRazorpaySignature } from '@/lib/razorpay-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /payments/verify — { orderId, paymentId, signature } -> { valid }
export const POST = withErrorHandling(async (req: NextRequest) => {
  if (!getUserId(req)) throw new ApiError(401, 'Authentication required');
  const { orderId, paymentId, signature } = await req.json();
  const valid = verifyRazorpaySignature(orderId, paymentId, signature);
  return json({ valid });
});
