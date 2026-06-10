import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { payoutResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'];

type Ctx = { params: Promise<{ id: string }> };

// PUT /payouts/{id}/status?status=&transactionId=
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const status = (req.nextUrl.searchParams.get('status') ?? '').toUpperCase();
  const transactionId = req.nextUrl.searchParams.get('transactionId');
  if (!VALID.includes(status)) return errorJson(`Invalid status: ${status}`, 400);

  const existing = await prisma.payout.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);

  const payout = await prisma.payout.update({
    where: { id },
    data: {
      status,
      ...(transactionId ? { transactionId } : {}),
      ...(status === 'COMPLETED' ? { paymentDate: new Date() } : {}),
    },
    include: { vendor: true },
  });
  return json(payoutResponse(payout));
});
