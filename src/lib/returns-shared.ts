export const serializeReturn = (r: {
  id: string; orderId: string; userId: string; reason: string; status: string;
  adminNote: string | null; refundAmount: unknown; resolvedAt: Date | null; createdAt: Date;
  order?: { totalAmount: unknown } | null;
}) => ({
  id: r.id,
  orderId: r.orderId,
  userId: r.userId,
  reason: r.reason,
  status: r.status,
  adminNote: r.adminNote,
  refundAmount: r.refundAmount != null ? Number(r.refundAmount) : null,
  orderTotal: r.order ? Number(r.order.totalAmount) : null,
  resolvedAt: r.resolvedAt?.toISOString() ?? null,
  createdAt: r.createdAt.toISOString(),
});
