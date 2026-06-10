import { NextRequest } from 'next/server';
import { getUserId } from '@/lib/server-auth';
import { ApiError, json, withErrorHandling } from '@/lib/api-helpers';
import { getCartSummary } from '@/lib/cart-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /cart/summary — { totalItems, totalPrice, itemCount }
export const GET = withErrorHandling(async (req: NextRequest) => {
  const userId = getUserId(req);
  if (!userId) throw new ApiError(401, 'Invalid token');
  return json(await getCartSummary(userId));
});
