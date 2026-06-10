import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { payoutResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /payouts?vendorId=
export const GET = withErrorHandling(async (req: NextRequest) => {
  const vendorId = req.nextUrl.searchParams.get('vendorId');
  const payouts = await prisma.payout.findMany({
    where: vendorId ? { vendorId } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { vendor: true },
  });
  return json(payouts.map(payoutResponse));
});

// POST /payouts — for an invoice; amount = invoice total.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const invoice = await prisma.gstInvoice.findUnique({ where: { id: body.invoiceId } });
  if (!invoice) throw new ApiError(400, `Invoice not found with id: ${body.invoiceId}`);

  const payout = await prisma.payout.create({
    data: {
      vendorId: invoice.vendorId,
      invoiceId: invoice.id,
      amount: invoice.totalAmount,
      paymentMethod: body.paymentMethod ?? 'BANK_TRANSFER',
      transactionId: body.transactionId ?? null,
      status: 'PENDING',
    },
    include: { vendor: true },
  });
  return json(payoutResponse(payout));
});
