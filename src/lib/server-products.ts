import 'server-only';
import { prisma } from './prisma';
import { serializeProduct, serializeProducts } from './products-service';
import { transformProductResponse } from '@/services/products-api';
import type { Candle } from '@/types/candle';

// Server components read products straight from the database — no HTTP
// round-trip to our own API. (Fetching https://$VERCEL_URL from inside a
// server function hits Vercel Deployment Protection and fails, which made
// every product page render notFound() in production.)

export async function getProductDirect(id: string): Promise<Candle | null> {
  try {
    const row = await prisma.product.findFirst({
      where: { id, isActive: true },
      include: { scentCategory: true },
    });
    if (!row) return null;
    return transformProductResponse(await serializeProduct(row));
  } catch (e) {
    console.error('[server-products] getProductDirect failed:', e);
    return null;
  }
}

/** Related = same category, active, excluding the product; popularity desc. */
export async function getRelatedDirect(categoryName: string, excludeId: string): Promise<Candle[]> {
  try {
    const rows = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: excludeId },
        scentCategory: { name: { equals: categoryName, mode: 'insensitive' } },
      },
      orderBy: { popularity: 'desc' },
      include: { scentCategory: true },
      take: 4,
    });
    return (await serializeProducts(rows)).map(transformProductResponse);
  } catch (e) {
    console.error('[server-products] getRelatedDirect failed:', e);
    return [];
  }
}
