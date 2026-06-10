import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { serializeReturn } from '@/lib/returns-shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RETURN_WINDOW_DAYS = 7;

// GET /returns — own return requests; admins see all (?status= filter).
export const GET = withErrorHandling(async (req: NextRequest) => {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required');
  const status = req.nextUrl.searchParams.get('status');
  const returns = await prisma.returnRequest.findMany({
    where: {
      ...(auth.role === 'ADMIN' ? {} : { userId: auth.userId }),
      ...(status ? { status: status.toUpperCase() } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: { order: { select: { totalAmount: true } } },
  });
  return json(returns.map(serializeReturn));
});

// POST /returns — { orderId, reason }. Own DELIVERED order, within the window, once.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const auth = getAuth(req);
  if (!auth) throw new ApiError(401, 'Authentication required');

  const { orderId, reason } = await req.json();
  if (!orderId || !reason?.trim()) throw new ApiError(400, 'orderId and reason are required');

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== auth.userId) throw new ApiError(404, 'Order not found');
  if (order.status !== 'DELIVERED') {
    throw new ApiError(400, 'Returns can only be requested for delivered orders');
  }
  const deliveredAt = order.deliveredAt ?? order.updatedAt;
  const windowMs = RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  if (Date.now() - deliveredAt.getTime() > windowMs) {
    throw new ApiError(400, `Return window of ${RETURN_WINDOW_DAYS} days has passed`);
  }
  const existing = await prisma.returnRequest.findUnique({ where: { orderId } });
  if (existing) throw new ApiError(409, 'A return request already exists for this order');

  const created = await prisma.returnRequest.create({
    data: { orderId, userId: auth.userId, reason: reason.trim() },
    include: { order: { select: { totalAmount: true } } },
  });
  return json(serializeReturn(created), 201);
});
