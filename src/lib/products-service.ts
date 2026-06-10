import { prisma } from './prisma';
import { getProductArraysMap } from './product-arrays';
import { productResponse } from './serializers';

type ProductWithCat = Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
  scentCategory?: unknown;
};

/** Attach raw-SQL string arrays + review aggregates and serialize in one batch
    (one groupBy for ratings across the whole list — no N+1). */
export async function serializeProducts(products: ProductWithCat[]) {
  const ids = products.map((p) => p.id);
  const [arraysMap, ratings] = await Promise.all([
    getProductArraysMap(ids),
    ids.length
      ? prisma.productReview.groupBy({
          by: ['productId'],
          where: { productId: { in: ids }, isApproved: true },
          _avg: { rating: true },
          _count: true,
        })
      : Promise.resolve([] as never[]),
  ]);
  const ratingMap = new Map(
    (ratings as Array<{ productId: string; _avg: { rating: number | null }; _count: number }>).map((r) => [
      r.productId,
      { average: r._avg.rating ? Math.round(r._avg.rating * 10) / 10 : null, count: r._count },
    ]),
  );
  return products.map((p) => ({
    ...productResponse(p as never, arraysMap.get(p.id) ?? { imageUrls: [], scentNotes: [], ingredients: [] }),
    averageRating: ratingMap.get(p.id)?.average ?? null,
    reviewCount: ratingMap.get(p.id)?.count ?? 0,
  }));
}

export async function serializeProduct(product: ProductWithCat) {
  const [r] = await serializeProducts([product]);
  return r;
}
