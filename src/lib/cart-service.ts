import { prisma } from './prisma';
import { ApiError, dec } from './api-helpers';
import { getProductArraysMap } from './product-arrays';

async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.cart.create({ data: { userId } });
}

export interface CartItemDto {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  price: number;
  quantity: number;
  subtotal: number;
}

/** Cart items joined with product details — only active products, like the old service. */
export async function getCartWithProducts(userId: string): Promise<CartItemDto[]> {
  const cart = await getOrCreateCart(userId);
  const items = await prisma.cartItem.findMany({ where: { cartId: cart.id } });
  if (items.length === 0) return [];

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));
  const arraysMap = await getProductArraysMap(products.map((p) => p.id));

  const out: CartItemDto[] = [];
  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) continue;
    const price = dec(product.price) ?? 0;
    const imageUrl = arraysMap.get(product.id)?.imageUrls[0] ?? '';
    out.push({
      id: item.id,
      productId: product.id,
      productName: product.name,
      productImageUrl: imageUrl,
      price,
      quantity: item.quantity,
      subtotal: price * item.quantity,
    });
  }
  return out;
}

export async function addItemToCart(userId: string, productId: string, quantity: number): Promise<void> {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.stockQuantity < quantity) throw new ApiError(400, 'Insufficient stock');

  const cart = await getOrCreateCart(userId);
  const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (existing) {
    const newQty = existing.quantity + quantity;
    if (product.stockQuantity < newQty) throw new ApiError(400, 'Insufficient stock');
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
  }
}

export async function updateCartItem(userId: string, productId: string, quantity: number): Promise<void> {
  if (quantity <= 0) return removeItemFromCart(userId, productId);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new ApiError(404, 'Product not found');
  if (product.stockQuantity < quantity) throw new ApiError(400, 'Insufficient stock');

  const cart = await getOrCreateCart(userId);
  const item = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (!item) throw new ApiError(404, 'Item not found in cart');
  await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
}

export async function removeItemFromCart(userId: string, productId: string): Promise<void> {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
}

export async function clearCart(userId: string): Promise<void> {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

export async function getCartSummary(userId: string) {
  const items = await getCartWithProducts(userId);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.subtotal, 0);
  return { totalItems, totalPrice, itemCount: items.length };
}
