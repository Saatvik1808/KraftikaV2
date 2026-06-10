import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, withErrorHandling } from '@/lib/api-helpers';
import { serializeProducts } from '@/lib/products-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET /products/{id}/related — same category, active, excluding this product.
export const GET = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const product = await prisma.product.findFirst({ where: { id, isActive: true } });
  if (!product || !product.scentCategoryId) return json([]);

  const related = await prisma.product.findMany({
    where: { scentCategoryId: product.scentCategoryId, isActive: true, id: { not: id } },
    orderBy: { popularity: 'desc' },
    include: { scentCategory: true },
  });
  return json(await serializeProducts(related));
});
