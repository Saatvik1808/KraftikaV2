import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling, CATALOG_CACHE } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

const serialize = (r: {
  id: string; rating: number; title: string | null; comment: string | null;
  verifiedPurchase: boolean; createdAt: Date;
  user?: { firstName: string | null; lastName: string | null } | null;
}) => ({
  id: r.id,
  rating: r.rating,
  title: r.title,
  comment: r.comment,
  verifiedPurchase: r.verifiedPurchase,
  // Privacy: first name + last initial only
  reviewerName: r.user
    ? [r.user.firstName, r.user.lastName ? `${r.user.lastName[0]}.` : null].filter(Boolean).join(' ') || 'Customer'
    : 'Customer',
  createdAt: r.createdAt.toISOString(),
});

// GET /products/{id}/reviews — approved reviews + aggregate { average, count }.
export const GET = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const [reviews, agg] = await Promise.all([
    prisma.productReview.findMany({
      where: { productId: id, isApproved: true },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { firstName: true, lastName: true } } },
      take: 100,
    }),
    prisma.productReview.aggregate({
      where: { productId: id, isApproved: true },
      _avg: { rating: true },
      _count: true,
    }),
  ]);
  return json(
    {
      average: agg._avg.rating ? Math.round(agg._avg.rating * 10) / 10 : null,
      count: agg._count,
      reviews: reviews.map(serialize),
    },
    200,
    CATALOG_CACHE,
  );
});

// POST /products/{id}/reviews — one review per user per product (upsert = edit).
// verifiedPurchase is computed: the user has a DELIVERED order containing this product.
export const POST = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required');

  const { id } = await params;
  const b = await req.json();
  const rating = Number(b.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ApiError(400, 'rating must be an integer 1-5');
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new ApiError(404, 'Product not found');

  const purchased = await prisma.orderItem.findFirst({
    where: { productId: id, order: { userId: auth.userId, status: 'DELIVERED' } },
    select: { id: true },
  });

  const review = await prisma.productReview.upsert({
    where: { productId_userId: { productId: id, userId: auth.userId } },
    create: {
      productId: id,
      userId: auth.userId,
      rating,
      title: b.title ?? null,
      comment: b.comment ?? null,
      verifiedPurchase: Boolean(purchased),
    },
    update: {
      rating,
      title: b.title ?? null,
      comment: b.comment ?? null,
      verifiedPurchase: Boolean(purchased),
    },
    include: { user: { select: { firstName: true, lastName: true } } },
  });

  return json(serialize(review), 201);
});
