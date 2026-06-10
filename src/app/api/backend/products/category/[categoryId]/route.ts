import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, withErrorHandling, CATALOG_CACHE } from '@/lib/api-helpers';
import { serializeProducts } from '@/lib/products-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ categoryId: string }> };

// GET /products/category/{categoryId} — active products in a category, popularity desc.
export const GET = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { categoryId } = await params;
  const products = await prisma.product.findMany({
    where: { scentCategoryId: categoryId, isActive: true },
    orderBy: { popularity: 'desc' },
    include: { scentCategory: true },
  });
  return json(await serializeProducts(products), 200, CATALOG_CACHE);
});
