import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { vendorOrderResponse } from '@/lib/serializers';
import { Prisma } from '@/generated/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const include = { vendor: true, orderItems: true } satisfies Prisma.VendorOrderInclude;

// GET /vendor-orders?vendorId=
export const GET = withErrorHandling(async (req: NextRequest) => {
  const vendorId = req.nextUrl.searchParams.get('vendorId');
  const orders = await prisma.vendorOrder.findMany({
    where: vendorId ? { vendorId } : undefined,
    orderBy: { createdAt: 'desc' },
    include,
  });
  return json(orders.map(vendorOrderResponse));
});

// POST /vendor-orders — compute wholesale/retail/margin totals from items.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();

  const vendor = await prisma.vendor.findUnique({ where: { id: body.vendorId } });
  if (!vendor) throw new ApiError(400, `Vendor not found with id: ${body.vendorId}`);

  let orderId: string = body.orderId?.trim() || `VO-${Date.now()}`;
  if (await prisma.vendorOrder.findUnique({ where: { orderId } })) {
    throw new ApiError(400, `Order ID already exists: ${orderId}`);
  }

  const items = (body.orderItems ?? []) as Array<{
    productId: string;
    productName: string;
    quantity: number;
    wholesalePrice: number | string;
    retailPrice: number | string;
  }>;

  let totalAmount = new Prisma.Decimal(0);
  let salePrice = new Prisma.Decimal(0);
  const itemData: Prisma.VendorOrderItemCreateWithoutVendorOrderInput[] = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) throw new ApiError(400, `Product not found with id: ${item.productId}`);
    const wholesale = new Prisma.Decimal(item.wholesalePrice);
    const retail = new Prisma.Decimal(item.retailPrice);
    totalAmount = totalAmount.add(wholesale.mul(item.quantity));
    salePrice = salePrice.add(retail.mul(item.quantity));
    itemData.push({
      product: { connect: { id: item.productId } },
      productName: item.productName,
      quantity: item.quantity,
      wholesalePrice: wholesale,
      retailPrice: retail,
      margin: retail.sub(wholesale),
    });
  }

  const created = await prisma.vendorOrder.create({
    data: {
      vendorId: body.vendorId,
      orderId,
      sentDate: new Date(),
      status: 'SENT',
      totalAmount,
      salePrice,
      margin: salePrice.sub(totalAmount),
      orderItems: { create: itemData },
    },
    include,
  });
  return json(vendorOrderResponse(created));
});
