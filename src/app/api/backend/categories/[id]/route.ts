import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/server-auth';
import { ApiError, json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { categoryResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET /categories/{id}
export const GET = withErrorHandling(async (_req: NextRequest, { params }: Ctx) => {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return errorJson('Not found', 404);
  return json(categoryResponse(category));
});

// PUT /categories/{id} — admin only, partial update.
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');
  const { id } = await params;
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return errorJson('Not found', 404);

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.name !== undefined && body.name !== existing.name) {
    const dup = await prisma.category.findUnique({ where: { name: body.name } });
    if (dup) return errorJson('Category with this name already exists', 400);
    data.name = body.name;
  }
  if (body.description !== undefined) data.description = body.description;
  if (body.color !== undefined) data.color = body.color;
  if (body.icon !== undefined) data.icon = body.icon;
  if (body.isActive !== undefined) data.isActive = body.isActive;

  const category = await prisma.category.update({ where: { id }, data });
  return json(categoryResponse(category));
});

// DELETE /categories/{id} — admin only; blocked if the category has products.
export const DELETE = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return errorJson('Not found', 404);

  const productCount = await prisma.product.count({ where: { scentCategoryId: id } });
  if (productCount > 0) return errorJson('Cannot delete category that has products', 400);

  await prisma.category.delete({ where: { id } });
  return json({ message: 'Category deleted successfully' });
});
