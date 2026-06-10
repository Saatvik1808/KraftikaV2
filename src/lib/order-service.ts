import { prisma } from './prisma';
import { ApiError } from './api-helpers';
import { Prisma } from '@/generated/prisma';

interface CreateOrderItem {
  productId: string;
  quantity: number;
}
interface CreateOrderRequest {
  shippingAddress?: unknown; // JSON string or object
  paymentMethod?: string;
  orderItems: CreateOrderItem[];
}

const orderInclude = {
  user: true,
  orderItems: { include: { product: true } },
} satisfies Prisma.OrderInclude;

export type OrderWithRelations = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

export async function listOrders(userId: string | null): Promise<OrderWithRelations[]> {
  return prisma.order.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: 'desc' },
    include: orderInclude,
  });
}

export async function getOrder(id: string): Promise<OrderWithRelations | null> {
  return prisma.order.findUnique({ where: { id }, include: orderInclude });
}

export async function updateOrderStatus(id: string, status: string): Promise<OrderWithRelations | null> {
  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return null;
  await prisma.order.update({ where: { id }, data: { status } });
  return getOrder(id);
}

export async function createOrder(userId: string, request: CreateOrderRequest): Promise<OrderWithRelations> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, 'User not found');

  if (!request.orderItems || request.orderItems.length === 0) {
    throw new ApiError(400, 'Order must contain at least one item');
  }

  // Normalize shipping address to a JSON value (column is jsonb).
  let shippingAddress: Prisma.InputJsonValue | undefined;
  if (request.shippingAddress != null) {
    try {
      shippingAddress =
        typeof request.shippingAddress === 'string'
          ? JSON.parse(request.shippingAddress)
          : (request.shippingAddress as Prisma.InputJsonValue);
    } catch {
      throw new ApiError(400, 'Invalid shipping address format');
    }
  }

  // Load products, validate stock, compute total.
  const products = await prisma.product.findMany({
    where: { id: { in: request.orderItems.map((i) => i.productId) } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  let total = new Prisma.Decimal(0);
  for (const item of request.orderItems) {
    const product = productMap.get(item.productId);
    if (!product) throw new ApiError(404, `Product not found: ${item.productId}`);
    if (product.stockQuantity < item.quantity) {
      throw new ApiError(400, `Insufficient stock for product: ${product.name}`);
    }
    total = total.add(product.price.mul(item.quantity));
  }

  const orderId = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount: total,
        status: 'PENDING',
        paymentMethod: request.paymentMethod ?? 'COD',
        shippingAddress,
        orderItems: {
          create: request.orderItems.map((item) => {
            const product = productMap.get(item.productId)!;
            return { productId: item.productId, quantity: item.quantity, price: product.price };
          }),
        },
      },
    });
    for (const item of request.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }
    // Clear the cart (best-effort).
    const cart = await tx.cart.findUnique({ where: { userId } });
    if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return order.id;
  });

  return (await getOrder(orderId))!;
}
