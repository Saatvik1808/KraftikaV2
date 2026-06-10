import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { invoiceResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID = ['DRAFT', 'SENT', 'PAID', 'OVERDUE'];

type Ctx = { params: Promise<{ id: string }> };

// PUT /gst-invoices/{id}/status?status=
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const status = (req.nextUrl.searchParams.get('status') ?? '').toUpperCase();
  if (!VALID.includes(status)) return errorJson(`Invalid status: ${status}`, 400);

  const existing = await prisma.gstInvoice.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);

  const invoice = await prisma.gstInvoice.update({
    where: { id },
    data: { status },
    include: { vendor: true, items: true },
  });
  return json(invoiceResponse(invoice));
});
