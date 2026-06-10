import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/server-auth';
import { withErrorHandling, errorJson, ApiError } from '@/lib/api-helpers';
import { getOrder } from '@/lib/order-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET /orders/{id}/invoice?token= — printable HTML invoice (owner or admin).
// Token can come from the Authorization header or ?token= (so it opens in a new tab).
export const GET = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const queryToken = req.nextUrl.searchParams.get('token');
  const authReq = queryToken
    ? new NextRequest(req.url, { headers: { authorization: `Bearer ${queryToken}` } })
    : req;
  const auth = getAuth(authReq);
  if (!auth) throw new ApiError(401, 'Authentication required');

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return errorJson('Not found', 404);
  if (auth.role !== 'ADMIN' && order.userId !== auth.userId) return errorJson('Not found', 404);

  const addr = (order.shippingAddress ?? {}) as Record<string, string>;
  const discount = order.discountAmount != null ? Number(order.discountAmount) : 0;
  const total = Number(order.totalAmount);
  const subtotal = total + discount;
  const fmtINR = (n: number) => `₹${n.toFixed(2)}`;
  const date = order.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const rows = order.orderItems
    .map(
      (i) => `<tr>
        <td>${i.product?.name ?? 'Item'}</td>
        <td class="num">${i.quantity}</td>
        <td class="num">${fmtINR(Number(i.price))}</td>
        <td class="num">${fmtINR(Number(i.price) * i.quantity)}</td>
      </tr>`,
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Invoice ${order.id.slice(0, 8)} — Kraftika</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #2d2218; max-width: 720px; margin: 32px auto; padding: 0 20px; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #d99e45; padding-bottom: 16px; }
  h1 { margin: 0; color: #9a5b13; font-size: 26px; }
  .muted { color: #7a6a55; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin: 24px 0; }
  th { text-align: left; color: #9a5b13; border-bottom: 2px solid #ecd9bd; padding: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
  td { padding: 10px 8px; border-bottom: 1px solid #f3e8d6; }
  .num { text-align: right; }
  .totals { margin-left: auto; width: 260px; }
  .totals td { border: none; padding: 4px 8px; }
  .grand { font-weight: bold; font-size: 18px; border-top: 2px solid #d99e45 !important; }
  .grid { display: flex; gap: 40px; margin-top: 20px; }
  .badge { display: inline-block; background: #fdf3e3; border: 1px solid #ecd9bd; color: #9a5b13; border-radius: 6px; padding: 2px 10px; font-size: 12px; }
  @media print { .no-print { display: none; } body { margin: 0; } }
</style></head>
<body>
  <div class="head">
    <div>
      <h1>KRAFTIKA STUDIO</h1>
      <p class="muted">Handcrafted scented candles · www.kraftikastudio.com</p>
    </div>
    <div style="text-align:right">
      <h2 style="margin:0">INVOICE</h2>
      <p class="muted">#${order.id.slice(0, 8).toUpperCase()}<br>${date}</p>
      <span class="badge">${order.status}</span>
    </div>
  </div>

  <div class="grid">
    <div>
      <p class="muted" style="margin-bottom:4px">BILLED TO</p>
      <p style="margin:0">
        ${[order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ') || order.user?.email || 'Customer'}<br>
        ${order.user?.email ?? ''}${order.user?.phone ? `<br>${order.user.phone}` : ''}
      </p>
    </div>
    <div>
      <p class="muted" style="margin-bottom:4px">SHIP TO</p>
      <p style="margin:0">
        ${addr.street ?? ''}<br>
        ${[addr.city, addr.state, addr.zipCode].filter(Boolean).join(', ')}<br>
        ${addr.country ?? 'India'}
      </p>
    </div>
    <div>
      <p class="muted" style="margin-bottom:4px">PAYMENT</p>
      <p style="margin:0">${order.paymentMethod ?? 'COD'}${order.paymentId ? `<br><span class="muted">${order.paymentId}</span>` : ''}</p>
    </div>
  </div>

  <table>
    <thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Unit Price</th><th class="num">Amount</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <table class="totals">
    <tr><td>Subtotal</td><td class="num">${fmtINR(subtotal)}</td></tr>
    ${discount > 0 ? `<tr><td>Discount${order.couponCode ? ` (${order.couponCode})` : ''}</td><td class="num">−${fmtINR(discount)}</td></tr>` : ''}
    <tr class="grand"><td class="grand">Total</td><td class="num grand">${fmtINR(total)}</td></tr>
  </table>

  <p class="muted">Thank you for shopping with Kraftika! Questions? studiokraftika@gmail.com</p>
  <button class="no-print" onclick="window.print()" style="padding:10px 24px; background:#d99e45; color:#fff; border:none; border-radius:8px; font-size:15px; cursor:pointer;">Print / Save as PDF</button>
</body></html>`;

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
});
