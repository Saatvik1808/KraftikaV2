import { prisma } from '@/lib/prisma';
import { json, withErrorHandling, CATALOG_CACHE } from '@/lib/api-helpers';
import { categoryResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /categories/active — active categories ordered by name.
export const GET = withErrorHandling(async () => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
  return json(categories.map(categoryResponse), 200, CATALOG_CACHE);
});
