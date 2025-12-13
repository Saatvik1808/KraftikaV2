# Payment Integration Guide - Razorpay

## Overview
This guide explains the complete payment system integration using Razorpay for Kraftika.

## Why Razorpay?
- **Free to start**: No monthly fees, only transaction fees (2% + GST)
- **Supports multiple payment methods**: UPI, Cards, Netbanking, Wallets
- **Easy integration**: Well-documented SDK
- **India-focused**: Perfect for Indian market

## Setup Instructions

### 1. Backend Setup

#### Add Razorpay Keys to `application.yml`:
```yaml
razorpay:
  key-id: ${RAZORPAY_KEY_ID:your_key_id_here}
  key-secret: ${RAZORPAY_KEY_SECRET:your_key_secret_here}
```

#### Environment Variables:
```bash
RAZORPAY_KEY_ID=rzp_test_xxxxx  # Get from Razorpay Dashboard
RAZORPAY_KEY_SECRET=xxxxx        # Get from Razorpay Dashboard
```

### 2. Frontend Setup

#### Add Razorpay Key to `.env.local`:
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### 3. Razorpay Dashboard Setup

1. Sign up at https://razorpay.com
2. Go to Settings → API Keys
3. Generate Test Keys (for development)
4. Copy Key ID and Key Secret
5. Add webhook URL: `https://your-domain.com/api/webhooks/razorpay`

## Payment Flow

1. User clicks "Place Order" on payment page
2. Frontend creates order in backend (status: PENDING)
3. If payment method is not COD:
   - Frontend calls Razorpay to create payment order
   - User completes payment on Razorpay checkout
   - Razorpay sends webhook to backend
   - Backend verifies payment and updates order status
4. If COD:
   - Order is created with status PENDING
   - Status changes to CONFIRMED after admin approval

## Order Status Flow

- **PENDING**: Order created, payment pending
- **CONFIRMED**: Payment successful, order confirmed
- **SHIPPED**: Order shipped
- **DELIVERED**: Order delivered
- **CANCELLED**: Order cancelled

## Files Modified/Created

### Backend:
- `OrderService.java` - Added createOrder method
- `OrderController.java` - Added POST /orders endpoint
- `OrderDto.java` - Added CreateOrderRequest
- `pom.xml` - Added Razorpay dependency

### Frontend:
- `payment/page.tsx` - Updated with Razorpay integration
- `orders/[id]/page.tsx` - Order confirmation page
- `orders/page.tsx` - Order tracking page
- `services/orders-api.ts` - Updated with createOrder method

## Testing

### Test Cards (Razorpay Test Mode):
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

## Production Checklist

- [ ] Switch to Razorpay Live Keys
- [ ] Update webhook URL to production domain
- [ ] Test payment flow end-to-end
- [ ] Set up email notifications for orders
- [ ] Configure shipping cost calculation
- [ ] Set up order tracking system

