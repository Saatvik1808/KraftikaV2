import { dec, isoDateTime, isoDate } from './api-helpers';
import type { ProductArrays } from './product-arrays';

// Convert Prisma rows into the exact JSON shapes the old Spring DTOs produced,
// so the existing frontend services keep working unchanged.

type AnyRow = Record<string, unknown>;

export function productResponse(
  p: AnyRow & { scentCategory?: AnyRow | null },
  arrays: ProductArrays,
) {
  const cat = p.scentCategory as AnyRow | null | undefined;
  return {
    id: String(p.id),
    name: p.name,
    description: p.description ?? null,
    price: dec(p.price as never),
    scentCategoryId: cat ? String(cat.id) : null,
    scentCategoryName: cat ? cat.name : null,
    scentNotes: arrays.scentNotes,
    burnTime: p.burnTime ?? null,
    ingredients: arrays.ingredients,
    imageUrls: arrays.imageUrls,
    popularity: p.popularity ?? 0,
    stockQuantity: p.stockQuantity ?? 0,
    isActive: p.isActive ?? true,
    createdAt: isoDateTime(p.createdAt as Date),
    updatedAt: isoDateTime(p.updatedAt as Date),
  };
}

export function categoryResponse(c: AnyRow) {
  return {
    id: String(c.id),
    name: c.name,
    description: c.description ?? null,
    color: c.color ?? null,
    icon: c.icon ?? null,
    isActive: c.isActive ?? true,
    productCount: c.productCount ?? 0,
    createdAt: isoDateTime(c.createdAt as Date),
    updatedAt: isoDateTime(c.updatedAt as Date),
  };
}

export function orderItemResponse(i: AnyRow & { product?: AnyRow }) {
  const price = dec(i.price as never) ?? 0;
  const qty = (i.quantity as number) ?? 0;
  return {
    id: String(i.id),
    productId: String(i.productId),
    productName: i.product ? (i.product as AnyRow).name : null,
    quantity: qty,
    price,
    subtotal: price * qty,
  };
}

export function orderResponse(o: AnyRow & { user?: AnyRow; orderItems?: AnyRow[] }) {
  return {
    id: String(o.id),
    userId: String(o.userId),
    userEmail: o.user ? (o.user as AnyRow).email ?? null : null,
    totalAmount: dec(o.totalAmount as never),
    status: o.status,
    // stored as jsonb; old API returned it as a JSON string
    shippingAddress:
      o.shippingAddress == null
        ? null
        : typeof o.shippingAddress === 'string'
          ? o.shippingAddress
          : JSON.stringify(o.shippingAddress),
    paymentMethod: o.paymentMethod ?? null,
    orderItems: (o.orderItems ?? []).map(orderItemResponse),
    createdAt: isoDateTime(o.createdAt as Date),
    updatedAt: isoDateTime(o.updatedAt as Date),
  };
}

export function vendorResponse(v: AnyRow) {
  return {
    id: String(v.id),
    name: v.name,
    email: v.email ?? null,
    phone: v.phone ?? null,
    address: v.address ?? null,
    gstNumber: v.gstNumber ?? null,
    panNumber: v.panNumber ?? null,
    contactPerson: v.contactPerson ?? null,
    marginPercentage: v.marginPercentage ?? 0,
    isActive: v.isActive ?? true,
    createdAt: isoDateTime(v.createdAt as Date),
    updatedAt: isoDateTime(v.updatedAt as Date),
  };
}

export function invoiceItemResponse(i: AnyRow) {
  return {
    id: String(i.id),
    productName: i.productName,
    hsnCode: i.hsnCode,
    quantity: i.quantity,
    unitPrice: dec(i.unitPrice as never),
    gstRate: dec(i.gstRate as never),
    taxableAmount: dec(i.taxableAmount as never),
    cgst: dec(i.cgst as never),
    sgst: dec(i.sgst as never),
    igst: dec(i.igst as never),
    total: dec(i.total as never),
  };
}

export function invoiceResponse(inv: AnyRow & { vendor?: AnyRow; items?: AnyRow[] }) {
  const vendor = inv.vendor as AnyRow | undefined;
  return {
    id: String(inv.id),
    vendorId: String(inv.vendorId),
    vendorName: vendor ? vendor.name : null,
    vendorGST: vendor ? vendor.gstNumber ?? null : null,
    invoiceNumber: inv.invoiceNumber,
    invoiceDate: isoDate(inv.invoiceDate as Date),
    dueDate: isoDate(inv.dueDate as Date),
    items: (inv.items ?? []).map(invoiceItemResponse),
    subtotal: dec(inv.subtotal as never),
    cgst: dec(inv.cgst as never),
    sgst: dec(inv.sgst as never),
    igst: dec(inv.igst as never),
    totalAmount: dec(inv.totalAmount as never),
    status: inv.status,
    createdAt: isoDateTime(inv.createdAt as Date),
    updatedAt: isoDateTime(inv.updatedAt as Date),
  };
}

export function payoutResponse(p: AnyRow & { vendor?: AnyRow }) {
  return {
    id: String(p.id),
    vendorId: String(p.vendorId),
    vendorName: p.vendor ? (p.vendor as AnyRow).name : null,
    invoiceId: String(p.invoiceId),
    amount: dec(p.amount as never),
    status: p.status,
    paymentDate: isoDateTime(p.paymentDate as Date),
    paymentMethod: p.paymentMethod,
    transactionId: p.transactionId ?? null,
    createdAt: isoDateTime(p.createdAt as Date),
    updatedAt: isoDateTime(p.updatedAt as Date),
  };
}

export function vendorOrderItemResponse(i: AnyRow) {
  return {
    id: String(i.id),
    productId: String(i.productId),
    productName: i.productName,
    quantity: i.quantity,
    wholesalePrice: dec(i.wholesalePrice as never),
    retailPrice: dec(i.retailPrice as never),
    margin: dec(i.margin as never),
  };
}

export function vendorOrderResponse(o: AnyRow & { vendor?: AnyRow; orderItems?: AnyRow[] }) {
  return {
    id: String(o.id),
    vendorId: String(o.vendorId),
    vendorName: o.vendor ? (o.vendor as AnyRow).name : null,
    orderId: o.orderId,
    orderItems: (o.orderItems ?? []).map(vendorOrderItemResponse),
    totalAmount: dec(o.totalAmount as never),
    salePrice: dec(o.salePrice as never),
    margin: dec(o.margin as never),
    status: o.status,
    sentDate: isoDateTime(o.sentDate as Date),
    soldDate: isoDateTime(o.soldDate as Date),
    createdAt: isoDateTime(o.createdAt as Date),
    updatedAt: isoDateTime(o.updatedAt as Date),
  };
}

export function authResponse(token: string, u: AnyRow) {
  return {
    token,
    userId: String(u.id),
    email: u.email ?? null,
    firstName: u.firstName ?? null,
    lastName: u.lastName ?? null,
    phone: u.phone ?? null,
    profileImageUrl: u.profileImageUrl ?? null,
    role: u.role,
    authProvider: u.authProvider ?? 'EMAIL',
  };
}
