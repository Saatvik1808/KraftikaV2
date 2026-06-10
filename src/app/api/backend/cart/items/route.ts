import { NextRequest } from 'next/server';
import { getUserId } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { addItemToCart, getCartWithProducts } from '@/lib/cart-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST /cart/items?productId=&quantity=1 — add item, return full cart.
export const POST = withErrorHandling(async (req: NextRequest) => {
  const userId = getUserId(req);
  if (!userId) throw new ApiError(401, 'Invalid token');

  const productId = req.nextUrl.searchParams.get('productId');
  const quantity = Number(req.nextUrl.searchParams.get('quantity') ?? '1');
  if (!productId) throw new ApiError(400, 'productId is required');

  await addItemToCart(userId, productId, quantity);
  return json(await getCartWithProducts(userId));
});
