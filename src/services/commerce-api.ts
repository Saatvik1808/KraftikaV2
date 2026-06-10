import { apiClient } from "./api";

// ── Address book ─────────────────────────────────────────────────────────────

export interface SavedAddress {
  id: string;
  label: string | null;
  fullName: string | null;
  phone: string | null;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export type AddressInput = Omit<SavedAddress, "id" | "isDefault"> & { isDefault?: boolean };

export const getAddresses = () => apiClient.get<SavedAddress[]>("/addresses");
export const createAddress = (a: Partial<AddressInput>) => apiClient.post<SavedAddress>("/addresses", a);
export const updateAddress = (id: string, a: Partial<AddressInput> & { isDefault?: boolean }) =>
  apiClient.put<SavedAddress>(`/addresses/${id}`, a);
export const deleteAddress = (id: string) => apiClient.delete<{ message: string }>(`/addresses/${id}`);

// ── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verifiedPurchase: boolean;
  reviewerName: string;
  createdAt: string;
}

export interface ReviewSummary {
  average: number | null;
  count: number;
  reviews: Review[];
}

export const getReviews = (productId: string) =>
  apiClient.get<ReviewSummary>(`/products/${productId}/reviews`);
export const submitReview = (productId: string, review: { rating: number; title?: string; comment?: string }) =>
  apiClient.post<Review>(`/products/${productId}/reviews`, review);
export const deleteReview = (reviewId: string) =>
  apiClient.delete<{ message: string }>(`/reviews/${reviewId}`);

// ── Returns ──────────────────────────────────────────────────────────────────

export interface ReturnRequest {
  id: string;
  orderId: string;
  userId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";
  adminNote: string | null;
  refundAmount: number | null;
  orderTotal: number | null;
  resolvedAt: string | null;
  createdAt: string;
}

export const getReturns = (status?: string) =>
  apiClient.get<ReturnRequest[]>(`/returns${status ? `?status=${status}` : ""}`);
export const requestReturn = (orderId: string, reason: string) =>
  apiClient.post<ReturnRequest>("/returns", { orderId, reason });
export const updateReturnStatus = (
  id: string,
  data: { status: string; adminNote?: string; refundAmount?: number },
) => apiClient.put<ReturnRequest>(`/returns/${id}/status`, data);

// ── Coupons ──────────────────────────────────────────────────────────────────

export interface CouponValidation {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  discount: number;
  finalAmount: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export const validateCouponCode = (code: string, subtotal: number) =>
  apiClient.post<CouponValidation>("/coupons/validate", { code, subtotal });
export const getCoupons = () => apiClient.get<Coupon[]>("/coupons");
export const createCoupon = (c: Partial<Coupon>) => apiClient.post<Coupon>("/coupons", c);
export const updateCoupon = (id: string, c: Partial<Coupon>) => apiClient.put<Coupon>(`/coupons/${id}`, c);
export const deleteCoupon = (id: string) => apiClient.delete<{ message: string }>(`/coupons/${id}`);

// ── Invoice ──────────────────────────────────────────────────────────────────

/** Opens the printable invoice in a new tab (token passed as query for the new tab). */
export function openInvoice(orderId: string): void {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem("kraftikaToken") ?? "";
  window.open(`/api/backend/orders/${orderId}/invoice?token=${encodeURIComponent(token)}`, "_blank");
}
