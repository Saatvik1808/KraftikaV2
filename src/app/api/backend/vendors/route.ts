import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { vendorResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /vendors — active vendors, newest first.
export const GET = withErrorHandling(async () => {
  const vendors = await prisma.vendor.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
  return json(vendors.map(vendorResponse));
});

// POST /vendors — gst/email/phone must be unique.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();

  if (body.gstNumber && (await prisma.vendor.findUnique({ where: { gstNumber: body.gstNumber } }))) {
    throw new ApiError(400, `Vendor with GST number ${body.gstNumber} already exists`);
  }
  if (body.email && (await prisma.vendor.findUnique({ where: { email: body.email } }))) {
    throw new ApiError(400, `Vendor with email ${body.email} already exists`);
  }
  if (body.phone && (await prisma.vendor.findUnique({ where: { phone: body.phone } }))) {
    throw new ApiError(400, `Vendor with phone ${body.phone} already exists`);
  }

  const vendor = await prisma.vendor.create({
    data: {
      name: body.name,
      email: body.email ?? null,
      phone: body.phone ?? null,
      address: body.address ?? null,
      gstNumber: body.gstNumber ?? null,
      panNumber: body.panNumber ?? null,
      contactPerson: body.contactPerson ?? null,
      marginPercentage: body.marginPercentage ?? 0,
      isActive: true,
    },
  });
  return json(vendorResponse(vendor));
});
