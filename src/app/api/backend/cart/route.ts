import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { getCartWithProducts, clearCart } from '@/lib/cart-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function requireUser(req: NextRequest): string {
  const userId = getUserId(req);
  if (!userId) throw new ApiError(401, 'Invalid token');
  return userId;
}

// GET /cart — items with product details.
export const GET = withErrorHandling(async (req: NextRequest) => {
  return json(await getCartWithProducts(requireUser(req)));
});

// DELETE /cart — clear cart.
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  await clearCart(requireUser(req));
  return new NextResponse(null, { status: 204 });
});
