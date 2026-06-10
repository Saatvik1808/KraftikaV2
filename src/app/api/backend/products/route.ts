import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { serializeProduct, serializeProducts } from '@/lib/products-service';
import { setProductArrays } from '@/lib/product-arrays';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /products — all active products, popularity desc (matches the old JOIN FETCH).
export const GET = withErrorHandling(async () => {
  const products = await prisma.product.findMany({
    where: { isActive: true, scentCategoryId: { not: null } },
    orderBy: { popularity: 'desc' },
    include: { scentCategory: true },
  });
  return json(await serializeProducts(products));
});

// POST /products — admin only.
export const POST = withErrorHandling(async (req: NextRequest) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');
  const body = await req.json();

  if (!body.scentCategoryId) throw new ApiError(400, 'Category not found');
  const category = await prisma.category.findUnique({ where: { id: body.scentCategoryId } });
  if (!category) throw new ApiError(400, 'Category not found');

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description ?? null,
      price: body.price,
      scentCategoryId: body.scentCategoryId,
      burnTime: body.burnTime ?? null,
      stockQuantity: body.stockQuantity ?? 0,
    },
    include: { scentCategory: true },
  });

  await setProductArrays(product.id, {
    imageUrls: body.imageUrls ?? [],
    scentNotes: body.scentNotes ?? [],
    ingredients: body.ingredients ?? [],
  });

  await prisma.category.update({
    where: { id: category.id },
    data: { productCount: { increment: 1 } },
  });

  return json(await serializeProduct(product));
});
