import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { vendorResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET /vendors/{id}
export const GET = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const vendor = await prisma.vendor.findUnique({ where: { id } });
  if (!vendor) return errorJson('Not found', 404);
  return json(vendorResponse(vendor));
});

// PUT /vendors/{id} — partial update.
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const existing = await prisma.vendor.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);

  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const k of ['name', 'email', 'phone', 'address', 'gstNumber', 'panNumber', 'contactPerson', 'marginPercentage', 'isActive'] as const) {
    if (body[k] !== undefined) data[k] = body[k];
  }
  const vendor = await prisma.vendor.update({ where: { id }, data });
  return json(vendorResponse(vendor));
});

// DELETE /vendors/{id} — soft delete (isActive = false), matching the old service.
export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const existing = await prisma.vendor.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);
  await prisma.vendor.update({ where: { id }, data: { isActive: false } });
  return json({ message: 'Vendor deleted successfully' });
});
