import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/server-auth';
import { ApiError, json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { serializeProduct } from '@/lib/products-service';
import { setProductArrays, deleteProductArrays } from '@/lib/product-arrays';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET /products/{id} — active product only.
export const GET = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { id, isActive: true },
    include: { scentCategory: true },
  });
  if (!product) return errorJson('Not found', 404);
  return json(await serializeProduct(product));
});

// PUT /products/{id} — admin only, partial update.
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');
  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.price !== undefined) data.price = body.price;
  if (body.burnTime !== undefined) data.burnTime = body.burnTime;
  if (body.stockQuantity !== undefined) data.stockQuantity = body.stockQuantity;
  if (body.isActive !== undefined) data.isActive = body.isActive;
  if (body.scentCategoryId !== undefined) {
    const category = await prisma.category.findUnique({ where: { id: body.scentCategoryId } });
    if (!category) throw new ApiError(400, 'Category not found');
    data.scentCategoryId = body.scentCategoryId;
  }

  const product = await prisma.product.update({
    where: { id },
    data,
    include: { scentCategory: true },
  });

  await setProductArrays(id, {
    ...(body.imageUrls !== undefined ? { imageUrls: body.imageUrls } : {}),
    ...(body.scentNotes !== undefined ? { scentNotes: body.scentNotes } : {}),
    ...(body.ingredients !== undefined ? { ingredients: body.ingredients } : {}),
  });

  return json(await serializeProduct(product));
});

// DELETE /products/{id} — admin only.
export const DELETE = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return errorJson('Not found', 404);

  if (product.scentCategoryId) {
    await prisma.category.update({
      where: { id: product.scentCategoryId },
      data: { productCount: { decrement: 1 } },
    }).catch(() => {});
  }
  await deleteProductArrays(id);
  await prisma.product.delete({ where: { id } });

  return json({ message: 'Product deleted successfully' });
});
