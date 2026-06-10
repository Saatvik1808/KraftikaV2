import { NextRequest } from 'next/server';
import { getUserId } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { updateCartItem, removeItemFromCart, getCartWithProducts } from '@/lib/cart-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ productId: string }> };

function requireUser(req: NextRequest): string {
  const userId = getUserId(req);
  if (!userId) throw new ApiError(401, 'Invalid token');
  return userId;
}

// PUT /cart/items/{productId}?quantity= — set quantity, return full cart.
export const PUT = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const userId = requireUser(req);
  const { productId } = await params;
  const quantity = Number(req.nextUrl.searchParams.get('quantity') ?? '0');
  await updateCartItem(userId, productId, quantity);
  return json(await getCartWithProducts(userId));
});

// DELETE /cart/items/{productId} — remove item, return full cart.
export const DELETE = withErrorHandling(async (req: NextRequest, { params }: Ctx) => {
  const userId = requireUser(req);
  const { productId } = await params;
  await removeItemFromCart(userId, productId);
  return json(await getCartWithProducts(userId));
});
