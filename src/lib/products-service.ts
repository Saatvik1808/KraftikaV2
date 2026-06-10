import { prisma } from './prisma';
import { getProductArraysMap } from './product-arrays';
import { productResponse } from './serializers';

type ProductWithCat = Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
  scentCategory?: unknown;
};

/** Attach the raw-SQL string arrays and serialize a list of products in one batch. */
export async function serializeProducts(products: ProductWithCat[]) {
  const ids = products.map((p) => p.id);
  const arraysMap = await getProductArraysMap(ids);
  return products.map((p) =>
    productResponse(p as never, arraysMap.get(p.id) ?? { imageUrls: [], scentNotes: [], ingredients: [] }),
  );
}

export async function serializeProduct(product: ProductWithCat) {
  const [r] = await serializeProducts([product]);
  return r;
}
