import nodemailer from 'nodemailer';
import { mailConfigured } from './mailer';

// Transactional order emails (confirmation / shipped / delivered / cancelled).
// All senders are best-effort: callers catch failures so email problems never
// fail the order operation itself.

const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || '587');
const MAIL_CC = process.env.MAIL_CC || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com';

function transport() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

export interface OrderEmailData {
  orderId: string;
  email: string | null;
  firstName?: string | null;
  totalAmount: number;
  items: Array<{ productName: string | null; quantity: number; price: number }>;
  trackingNumber?: string | null;
  courierName?: string | null;
  trackingUrl?: string | null;
}

const wrap = (inner: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background:#fffaf3; border-radius:12px;">
  <h2 style="color:#9a5b13; margin-top:0;">Kraftika Studio</h2>
  ${inner}
  <p style="color:#6b5744; font-size:13px; margin-top:28px;">
    Questions? Just reply to this email.<br/>— The Kraftika Team
  </p>
</div>`;

const itemsTable = (d: OrderEmailData) => `
<table style="width:100%; border-collapse:collapse; margin:16px 0;">
  <tr style="text-align:left; color:#9a5b13;">
    <th style="padding:6px 8px; border-bottom:1px solid #ecd9bd;">Item</th>
    <th style="padding:6px 8px; border-bottom:1px solid #ecd9bd;">Qty</th>
    <th style="padding:6px 8px; border-bottom:1px solid #ecd9bd;">Price</th>
  </tr>
  ${d.items
    .map(
      (i) => `<tr>
    <td style="padding:6px 8px; border-bottom:1px solid #f3e8d6;">${i.productName ?? 'Candle'}</td>
    <td style="padding:6px 8px; border-bottom:1px solid #f3e8d6;">${i.quantity}</td>
    <td style="padding:6px 8px; border-bottom:1px solid #f3e8d6;">₹${i.price.toFixed(2)}</td>
  </tr>`,
    )
    .join('')}
  <tr>
    <td colspan="2" style="padding:8px; font-weight:bold;">Total</td>
    <td style="padding:8px; font-weight:bold;">₹${d.totalAmount.toFixed(2)}</td>
  </tr>
</table>
<p><a href="${SITE_URL}/orders/${d.orderId}" style="color:#b4690e;">View your order</a></p>`;

async function send(to: string, subject: string, html: string): Promise<void> {
  if (!mailConfigured()) {
    console.warn('[order-email] SMTP not configured, skipping:', subject);
    return;
  }
  await transport().sendMail({ from: SMTP_USER, to, cc: MAIL_CC || undefined, subject, html });
}

export async function sendOrderConfirmation(d: OrderEmailData): Promise<void> {
  if (!d.email) return;
  const greeting = d.firstName ? `Dear ${d.firstName},` : 'Hello,';
  await send(
    d.email,
    `Order confirmed — #${d.orderId.slice(0, 8)} | Kraftika`,
    wrap(`
      <p>${greeting}</p>
      <p>Thank you for your order! We've received it and will start hand-pouring your candles right away.</p>
      ${itemsTable(d)}
      <p>We'll email you again when your order ships.</p>`),
  );
}

export async function sendOrderShipped(d: OrderEmailData): Promise<void> {
  if (!d.email) return;
  const greeting = d.firstName ? `Dear ${d.firstName},` : 'Hello,';
  const tracking = d.trackingNumber
    ? `<div style="background:#fdf3e3; padding:14px 16px; border-radius:8px; margin:16px 0;">
        <p style="margin:0;"><strong>Courier:</strong> ${d.courierName ?? '—'}</p>
        <p style="margin:6px 0 0;"><strong>Tracking number:</strong> ${d.trackingNumber}</p>
        ${d.trackingUrl ? `<p style="margin:6px 0 0;"><a href="${d.trackingUrl}" style="color:#b4690e;">Track your package</a></p>` : ''}
      </div>`
    : '';
  await send(
    d.email,
    `Your order is on its way! — #${d.orderId.slice(0, 8)} | Kraftika`,
    wrap(`
      <p>${greeting}</p>
      <p>Great news — your Kraftika order has shipped! 📦</p>
      ${tracking}
      ${itemsTable(d)}`),
  );
}

export async function sendOrderDelivered(d: OrderEmailData): Promise<void> {
  if (!d.email) return;
  const greeting = d.firstName ? `Dear ${d.firstName},` : 'Hello,';
  await send(
    d.email,
    `Delivered — enjoy your candles! #${d.orderId.slice(0, 8)} | Kraftika`,
    wrap(`
      <p>${greeting}</p>
      <p>Your order has been delivered. We hope these candles bring warmth to your home! 🕯️</p>
      <p>Tip: trim the wick to 5&nbsp;mm before each burn, and let the wax pool reach the edges on the first burn for an even melt.</p>
      <p><a href="${SITE_URL}/products" style="color:#b4690e;">Shop again</a></p>`),
  );
}

export async function sendOrderCancelled(d: OrderEmailData): Promise<void> {
  if (!d.email) return;
  const greeting = d.firstName ? `Dear ${d.firstName},` : 'Hello,';
  await send(
    d.email,
    `Order cancelled — #${d.orderId.slice(0, 8)} | Kraftika`,
    wrap(`
      <p>${greeting}</p>
      <p>Your order has been cancelled. If you paid online, the refund will be processed to your original payment method within 5–7 business days.</p>
      <p>If this wasn't expected, reply to this email and we'll sort it out.</p>`),
  );
}
