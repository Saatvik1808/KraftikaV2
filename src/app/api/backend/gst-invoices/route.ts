import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { invoiceResponse } from '@/lib/serializers';
import { Prisma } from '@/generated/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const include = { vendor: true, items: true } satisfies Prisma.GstInvoiceInclude;

function generateInvoiceNumber(): string {
  const d = new Date();
  const datePart = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rnd = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `INV-${datePart}-${rnd}`;
}

function round2(d: Prisma.Decimal): Prisma.Decimal {
  return d.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

// GET /gst-invoices?vendorId=
export const GET = withErrorHandling(async (req: NextRequest) => {
  const vendorId = req.nextUrl.searchParams.get('vendorId');
  const invoices = await prisma.gstInvoice.findMany({
    where: vendorId ? { vendorId } : undefined,
    orderBy: { createdAt: 'desc' },
    include,
  });
  return json(invoices.map(invoiceResponse));
});

// POST /gst-invoices — computes CGST/SGST (intra-state) or IGST (inter-state).
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();

  const vendor = await prisma.vendor.findUnique({ where: { id: body.vendorId } });
  if (!vendor) throw new ApiError(400, `Vendor not found with id: ${body.vendorId}`);

  const invoiceNumber = generateInvoiceNumber();
  if (await prisma.gstInvoice.findUnique({ where: { invoiceNumber } })) {
    throw new ApiError(400, `Invoice number already exists: ${invoiceNumber}`);
  }

  const invoiceDate = body.invoiceDate ? new Date(body.invoiceDate) : new Date();
  const dueDate = body.dueDate
    ? new Date(body.dueDate)
    : new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const isInterState = Boolean(body.isInterState);

  let subtotal = new Prisma.Decimal(0);
  let totalCgst = new Prisma.Decimal(0);
  let totalSgst = new Prisma.Decimal(0);
  let totalIgst = new Prisma.Decimal(0);
  const itemData: Prisma.GstInvoiceItemCreateWithoutInvoiceInput[] = [];

  for (const it of body.items ?? []) {
    const unitPrice = new Prisma.Decimal(it.unitPrice);
    const gstRate = new Prisma.Decimal(it.gstRate);
    const itemSubtotal = unitPrice.mul(it.quantity);
    const gstAmount = itemSubtotal.mul(gstRate.div(100));

    let cgst = new Prisma.Decimal(0);
    let sgst = new Prisma.Decimal(0);
    let igst = new Prisma.Decimal(0);
    if (isInterState) {
      igst = gstAmount;
      totalIgst = totalIgst.add(gstAmount);
    } else {
      const half = round2(gstAmount.div(2));
      cgst = half;
      sgst = half;
      totalCgst = totalCgst.add(half);
      totalSgst = totalSgst.add(half);
    }

    itemData.push({
      productName: it.productName,
      hsnCode: it.hsnCode,
      quantity: it.quantity,
      unitPrice,
      gstRate,
      taxableAmount: itemSubtotal,
      cgst,
      sgst,
      igst,
      total: itemSubtotal.add(gstAmount),
    });
    subtotal = subtotal.add(itemSubtotal);
  }

  const created = await prisma.gstInvoice.create({
    data: {
      vendorId: body.vendorId,
      invoiceNumber,
      invoiceDate,
      dueDate,
      status: 'DRAFT',
      subtotal,
      cgst: totalCgst,
      sgst: totalSgst,
      igst: totalIgst,
      totalAmount: subtotal.add(totalCgst).add(totalSgst).add(totalIgst),
      items: { create: itemData },
    },
    include,
  });
  return json(invoiceResponse(created));
});
