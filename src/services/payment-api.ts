import { apiClient } from "./api";

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  keyId: string;
}

export interface PaymentVerificationRequest {
  orderId: string;
  paymentId: string;
  signature: string;
  /** Our own order id — when provided, a valid payment confirms this order. */
  internalOrderId?: string;
}

/**
 * Create Razorpay order
 */
export async function createRazorpayOrder(amount: number, currency: string = "INR", receipt?: string): Promise<RazorpayOrderResponse> {
  try {
    // Razorpay receipt must be <= 40 characters
    let receiptId = receipt;
    if (!receiptId) {
      receiptId = `rcpt_${Date.now()}`;
    }
    
    // Ensure receipt is <= 40 characters
    if (receiptId.length > 40) {
      // Remove dashes and use last 40 chars
      const cleaned = receiptId.replace(/-/g, '');
      receiptId = cleaned.length > 40 ? cleaned.slice(-40) : cleaned;
    }
    
    const response = await apiClient.post<RazorpayOrderResponse>("/payments/create-order", {
      amount,
      currency,
      receipt: receiptId,
    });
    return response;
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    throw new Error(error.message || "Failed to create payment order");
  }
}

/**
 * Verify payment signature
 */
export async function verifyPayment(request: PaymentVerificationRequest): Promise<boolean> {
  try {
    const response = await apiClient.post<{ valid: boolean }>("/payments/verify", request);
    return response.valid;
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return false;
  }
}

