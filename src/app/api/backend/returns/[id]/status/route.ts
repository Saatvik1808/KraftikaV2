import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/server-auth';
import { ApiError, json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { serializeReturn } from '@/lib/returns-shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID = ['PENDING', 'APPROVED', 'REJECTED', 'REFUNDED'];

type Ctx = { params: Promise<{ id: string }> };

// PUT /returns/{id}/status — admin. Body: { status, adminNote?, refundAmount? }
// REFUNDED restocks the returned items.
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');

  const { id } = await params;
  const b = await req.json();
  const status = (b.status ?? '').toUpperCase();
  if (!VALID.includes(status)) return errorJson(`Invalid status: ${b.status}`, 400);

  const existing = await prisma.returnRequest.findUnique({
    where: { id },
    include: { order: { include: { orderItems: true } } },
  });
  if (!existing) return errorJson('Not found', 404);

  const updated = await prisma.$transaction(async (tx) => {
    if (status === 'REFUNDED' && existing.status !== 'REFUNDED') {
      // Restock returned items
      for (const item of existing.order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });
      }
    }
    return tx.returnRequest.update({
      where: { id },
      data: {
        status,
        adminNote: b.adminNote ?? existing.adminNote,
        refundAmount:
          b.refundAmount != null
            ? b.refundAmount
            : status === 'REFUNDED' && existing.refundAmount == null
              ? existing.order.totalAmount
              : existing.refundAmount,
        resolvedAt: ['APPROVED', 'REJECTED', 'REFUNDED'].includes(status)
          ? existing.resolvedAt ?? new Date()
          : existing.resolvedAt,
      },
      include: { order: { select: { totalAmount: true } } },
    });
  });

  return json(serializeReturn(updated));
});
