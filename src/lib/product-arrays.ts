import { prisma } from './prisma';
import { Prisma } from '@/generated/prisma';

// The original backend stored these as Hibernate @ElementCollection tables, which
// have no primary key and so cannot be modeled as Prisma relations. We read/write
// them with raw SQL instead.
//   product_images       (product_id uuid, image_url text)
//   product_scent_notes  (product_id uuid, scent_note text)
//   product_ingredients  (product_id uuid, ingredient text)

export interface ProductArrays {
  imageUrls: string[];
  scentNotes: string[];
  ingredients: string[];
}

const EMPTY: ProductArrays = { imageUrls: [], scentNotes: [], ingredients: [] };

/** Fetch the three string arrays for many products in one round-trip each. */
export async function getProductArraysMap(
  productIds: string[],
): Promise<Map<string, ProductArrays>> {
  const map = new Map<string, ProductArrays>();
  if (productIds.length === 0) return map;
  for (const id of productIds) map.set(id, { imageUrls: [], scentNotes: [], ingredients: [] });

  const ids = Prisma.join(productIds.map((id) => Prisma.sql`${id}::uuid`));

  const [images, notes, ingredients] = await Promise.all([
    prisma.$queryRaw<{ product_id: string; image_url: string }[]>(
      Prisma.sql`SELECT product_id::text, image_url FROM product_images WHERE product_id IN (${ids})`,
    ),
    prisma.$queryRaw<{ product_id: string; scent_note: string }[]>(
      Prisma.sql`SELECT product_id::text, scent_note FROM product_scent_notes WHERE product_id IN (${ids})`,
    ),
    prisma.$queryRaw<{ product_id: string; ingredient: string }[]>(
      Prisma.sql`SELECT product_id::text, ingredient FROM product_ingredients WHERE product_id IN (${ids})`,
    ),
  ]);

  for (const r of images) map.get(r.product_id)?.imageUrls.push(r.image_url);
  for (const r of notes) map.get(r.product_id)?.scentNotes.push(r.scent_note);
  for (const r of ingredients) map.get(r.product_id)?.ingredients.push(r.ingredient);

  return map;
}

export async function getProductArrays(productId: string): Promise<ProductArrays> {
  return (await getProductArraysMap([productId])).get(productId) ?? { ...EMPTY };
}

/** Replace the string arrays for a product (delete-then-insert), only for provided keys. */
export async function setProductArrays(
  productId: string,
  arrays: Partial<ProductArrays>,
): Promise<void> {
  const ops: Prisma.PrismaPromise<unknown>[] = [];

  if (arrays.imageUrls !== undefined) {
    ops.push(prisma.$executeRaw`DELETE FROM product_images WHERE product_id = ${productId}::uuid`);
    for (const url of arrays.imageUrls) {
      ops.push(
        prisma.$executeRaw`INSERT INTO product_images (product_id, image_url) VALUES (${productId}::uuid, ${url})`,
      );
    }
  }
  if (arrays.scentNotes !== undefined) {
    ops.push(prisma.$executeRaw`DELETE FROM product_scent_notes WHERE product_id = ${productId}::uuid`);
    for (const note of arrays.scentNotes) {
      ops.push(
        prisma.$executeRaw`INSERT INTO product_scent_notes (product_id, scent_note) VALUES (${productId}::uuid, ${note})`,
      );
    }
  }
  if (arrays.ingredients !== undefined) {
    ops.push(prisma.$executeRaw`DELETE FROM product_ingredients WHERE product_id = ${productId}::uuid`);
    for (const ing of arrays.ingredients) {
      ops.push(
        prisma.$executeRaw`INSERT INTO product_ingredients (product_id, ingredient) VALUES (${productId}::uuid, ${ing})`,
      );
    }
  }

  if (ops.length) await prisma.$transaction(ops);
}

export async function deleteProductArrays(productId: string): Promise<void> {
  await prisma.$transaction([
    prisma.$executeRaw`DELETE FROM product_images WHERE product_id = ${productId}::uuid`,
    prisma.$executeRaw`DELETE FROM product_scent_notes WHERE product_id = ${productId}::uuid`,
    prisma.$executeRaw`DELETE FROM product_ingredients WHERE product_id = ${productId}::uuid`,
  ]);
}
