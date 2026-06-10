import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { payoutResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET /payouts/{id}
export const GET = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const payout = await prisma.payout.findUnique({ where: { id }, include: { vendor: true } });
  if (!payout) return errorJson('Not found', 404);
  return json(payoutResponse(payout));
});

// DELETE /payouts/{id}
export const DELETE = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const existing = await prisma.payout.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);
  await prisma.payout.delete({ where: { id } });
  return json({ message: 'Payout deleted successfully' });
});
