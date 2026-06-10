import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { invoiceResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET /gst-invoices/{id}
export const GET = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const invoice = await prisma.gstInvoice.findUnique({
    where: { id },
    include: { vendor: true, items: true },
  });
  if (!invoice) return errorJson('Not found', 404);
  return json(invoiceResponse(invoice));
});

// DELETE /gst-invoices/{id}
export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const existing = await prisma.gstInvoice.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);
  await prisma.gstInvoice.delete({ where: { id } });
  return json({ message: 'Invoice deleted successfully' });
});
