import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/server-auth';
import { ApiError, json, errorJson, withErrorHandling } from '@/lib/api-helpers';
import { categoryResponse } from '@/lib/serializers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /categories — all categories.
export const GET = withErrorHandling(async () => {
  const categories = await prisma.category.findMany();
  return json(categories.map(categoryResponse));
});

// POST /categories — admin only.
export const POST = withErrorHandling(async (req: NextRequest) => {
  if (!isAdmin(req)) throw new ApiError(403, 'Admin access required');
  const body = await req.json();
  const exists = await prisma.category.findUnique({ where: { name: body.name } });
  if (exists) return errorJson('Category with this name already exists', 400);

  const category = await prisma.category.create({
    data: {
      name: body.name,
      description: body.description ?? null,
      color: body.color ?? null,
      icon: body.icon ?? null,
    },
  });
  return json(categoryResponse(category));
});
