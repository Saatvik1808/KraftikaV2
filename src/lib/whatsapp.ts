// WhatsApp order notifications via Meta's WhatsApp Business Cloud API.
// Free tier: 1000 service conversations/month — plenty for a small shop.
//
// Setup (one-time):
//   1. https://developers.facebook.com → create app → add "WhatsApp" product
//   2. Get the Phone Number ID + a permanent access token
//   3. Set env: WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN
//
// Unconfigured = silently skipped, so the shop works fine without it.

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '';

export function whatsappConfigured(): boolean {
  return Boolean(PHONE_NUMBER_ID && ACCESS_TOKEN);
}

/** Normalize an Indian phone number to E.164 without the +. */
function normalize(phone: string): string | null {
  const digits = phone.replace(/[^\d]/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  if (digits.length > 12) return digits; // already has country code
  return null;
}

async function sendText(phone: string, body: string): Promise<void> {
  if (!whatsappConfigured()) {
    console.log('[whatsapp] not configured, skipping message');
    return;
  }
  const to = normalize(phone);
  if (!to) return;

  const res = await fetch(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body },
    }),
  });
  if (!res.ok) {
    console.error('[whatsapp] send failed:', res.status, await res.text());
  }
}

export async function notifyOrderPlaced(phone: string | null, orderId: string, total: number): Promise<void> {
  if (!phone) return;
  await sendText(
    phone,
    `🕯️ Kraftika: Your order #${orderId.slice(0, 8)} (₹${total.toFixed(0)}) is confirmed! We'll message you when it ships. Track: https://www.kraftikastudio.com/orders/${orderId}`,
  );
}

export async function notifyOrderShipped(
  phone: string | null,
  orderId: string,
  trackingNumber?: string | null,
  courier?: string | null,
): Promise<void> {
  if (!phone) return;
  const tracking = trackingNumber ? ` Tracking: ${trackingNumber}${courier ? ` (${courier})` : ''}.` : '';
  await sendText(
    phone,
    `📦 Kraftika: Your order #${orderId.slice(0, 8)} has shipped!${tracking} Details: https://www.kraftikastudio.com/orders/${orderId}`,
  );
}
