import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/server-auth';
import { ApiError, json, errorJson, withErrorHandling } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// DELETE /reviews/{id} — author or admin.
export const DELETE = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required');

  const { id } = await params;
  const review = await prisma.productReview.findUnique({ where: { id } });
  if (!review) return errorJson('Not found', 404);
  if (auth.role !== 'ADMIN' && review.userId !== auth.userId) return errorJson('Not found', 404);

  await prisma.productReview.delete({ where: { id } });
  return json({ message: 'Review deleted' });
});
