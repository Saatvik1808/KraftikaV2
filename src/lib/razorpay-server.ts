import Razorpay from 'razorpay';
import crypto from 'crypto';

const KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

export function razorpayKeyId(): string {
  return KEY_ID;
}

/** Create a Razorpay order. `amountRupees` is converted to paise (×100), like the old service. */
export async function createRazorpayOrder(
  amountRupees: number,
  currency: string,
  receipt: string,
): Promise<{ id: string; amount: number; currency: string; receipt?: string }> {
  if (!KEY_ID || !KEY_SECRET) throw new Error('Razorpay keys not configured');
  const client = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
  const order = await client.orders.create({
    amount: Math.round(amountRupees * 100),
    currency: currency || 'INR',
    receipt,
  });
  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    receipt: order.receipt,
  };
}

/** Verify payment signature: HMAC-SHA256(orderId|paymentId, keySecret) === signature. */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  if (!KEY_SECRET) return false;
  const expected = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
