import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { json, withErrorHandling, CATALOG_CACHE } from '@/lib/api-helpers';
import { serializeProducts } from '@/lib/products-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /products/search?q=... — name/description contains, case-insensitive.
export const GET = withErrorHandling(async (req: NextRequest) => {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      scentCategoryId: { not: null },
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    },
    orderBy: { popularity: 'desc' },
    include: { scentCategory: true },
  });
  return json(await serializeProducts(products), 200, CATALOG_CACHE);
});
