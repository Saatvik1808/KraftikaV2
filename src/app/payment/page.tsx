"use client";

import { ShoppingBag, CreditCard, MapPin, ArrowLeft, Image as ImageIcon, Loader2, TicketPercent, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cartApi } from "@/services/cart-api";
import { PageLoader } from "@/components/ui/loader";
import type { ShippingAddress } from "@/types/order";
import { createOrder } from "@/services/orders-api";
import { createRazorpayOrder, verifyPayment } from "@/services/payment-api";
import { validateCouponCode, getAddresses, type SavedAddress, type CouponValidation } from "@/services/commerce-api";
import { trackPurchase } from "@/lib/analytics";

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Form state
  const [shippingAddress, setShippingAddress] = React.useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = React.useState("COD"); // COD, UPI, Card
  const [savedAddresses, setSavedAddresses] = React.useState<SavedAddress[]>([]);
  const [couponInput, setCouponInput] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<CouponValidation | null>(null);
  const [couponBusy, setCouponBusy] = React.useState(false);
  
  // Load cart items
  React.useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        if (isAuthenticated) {
          try {
            const cart = await cartApi.getCart();
            setCartItems(cart);
          } catch (error: any) {
            console.error("Failed to load cart:", error);
            toast({
              title: "Error",
              description: error.message || "Failed to load cart. Please try again.",
              variant: "destructive",
            });
            // Redirect to cart if cart is empty
            router.push("/cart");
          }
        } else {
          // For non-authenticated users, load from localStorage
          const cartString = localStorage.getItem('kraftikaCart');
          if (!cartString || cartString === '[]') {
            router.push("/cart");
            return;
          }
          // This is a simplified version - you might want to fetch products
          // For now, redirect to login if not authenticated
          router.push("/login?redirect=/payment");
          return;
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
        router.push("/cart");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, [isAuthenticated, router, toast]);

  // Load saved addresses; prefill with the default one.
  React.useEffect(() => {
    if (!isAuthenticated) return;
    getAddresses()
      .then((list) => {
        setSavedAddresses(list);
        const def = list.find((a) => a.isDefault) ?? list[0];
        if (def) {
          setShippingAddress({
            street: def.street, city: def.city, state: def.state,
            zipCode: def.zipCode, country: def.country,
          });
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponBusy(true);
    try {
      const subtotalNow = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
      const result = await validateCouponCode(couponInput.trim(), subtotalNow);
      setAppliedCoupon(result);
      toast({ title: "Coupon applied!", description: `You saved ₹${result.discount.toFixed(2)}` });
    } catch (e: any) {
      setAppliedCoupon(null);
      toast({ title: "Invalid coupon", description: e.message, variant: "destructive" });
    } finally {
      setCouponBusy(false);
    }
  };

  // Load Razorpay script
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout.",
        variant: "destructive",
      });
      router.push("/login?redirect=/payment");
      return;
    }

    // Validate shipping address
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast({
        title: "Incomplete Address",
        description: "Please fill in all shipping address fields.",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items to cart.",
        variant: "destructive",
      });
      router.push("/cart");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Calculate totals (discount recomputed server-side too)
      const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
      const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
      const discount = appliedCoupon?.discount ?? 0;
      const total = Math.max(0, subtotal + shippingCost - discount);

      // Create order in backend first (status: PENDING)
      const orderData = {
        shippingAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code,
        orderItems: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      let createdOrder;
      
      // Handle COD payment
      if (paymentMethod === "COD") {
        createdOrder = await createOrder(orderData);
        
        if (!createdOrder || !createdOrder.id) {
          toast({
            title: "Order Creation Failed",
            description: "Failed to create order. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        // Track purchase completion
        trackPurchase(
          createdOrder.id,
          cartItems.map(item => ({
            id: item.productId,
            name: item.productName,
            price: item.price,
            quantity: item.quantity,
            category: item.scentCategory || 'Candles',
          })),
          total,
          0, // tax
          shippingCost
        );
        
        toast({
          title: "Order Placed Successfully!",
          description: "Your order has been placed. You will receive a confirmation email shortly.",
        });

        router.push(`/orders/${createdOrder.id}`);
        return;
      }

      // Handle online payment (Razorpay)
      // First create order in our system
      createdOrder = await createOrder(orderData);
      
      if (!createdOrder || !createdOrder.id) {
        toast({
          title: "Order Creation Failed",
          description: "Failed to create order. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      // Create Razorpay order
      // Razorpay receipt must be <= 40 characters
      // Use last 32 chars of UUID (after removing dashes) = 32 + "ord" = 35 chars
      const receiptId = createdOrder.id.replace(/-/g, '').slice(-32);
      const razorpayOrder = await createRazorpayOrder(
        total,
        "INR",
        `ord${receiptId}`
      );

      // Initialize Razorpay checkout
      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Kraftika",
        description: `Order #${createdOrder.id}`,
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Verify payment signature; on success the backend links the
            // payment to our order and marks it CONFIRMED.
            const isValid = await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              internalOrderId: createdOrder.id,
            });

            if (isValid) {
              // Track purchase completion
              trackPurchase(
                createdOrder.id,
                cartItems.map(item => ({
                  id: item.productId,
                  name: item.productName,
                  price: item.price,
                  quantity: item.quantity,
                  category: item.scentCategory || 'Candles',
                })),
                total,
                0, // tax
                shippingCost
              );
              
              toast({
                title: "Payment Successful!",
                description: "Your order has been confirmed.",
              });
              router.push(`/orders/${createdOrder.id}`);
            } else {
              toast({
                title: "Payment Verification Failed",
                description: "Please contact support if payment was deducted.",
                variant: "destructive",
              });
            }
          } catch (error: any) {
            console.error("Payment verification error:", error);
            toast({
              title: "Error",
              description: "Payment verification failed. Please contact support.",
              variant: "destructive",
            });
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#caa494",
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
            toast({
              title: "Payment Cancelled",
              description: "You can complete the payment later from your orders.",
            });
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
      
    } catch (error: any) {
      console.error("Failed to place order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading checkout..." />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Card className="text-center p-10">
          <CardHeader>
            <CardTitle className="text-2xl">Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Please add items to your cart before checkout.
            </p>
            <Button asChild>
              <Link href="/cart">Go to Cart</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal + shippingCost - discount);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-6xl px-4 py-12"
    >
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/cart">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl flex items-center">
          <CreditCard className="mr-3 h-8 w-8 text-primary" />
          Checkout
          </h1>
            </div>
            
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="glassmorphism border border-[hsl(var(--border)/0.2)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedAddresses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {savedAddresses.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() =>
                          setShippingAddress({
                            street: a.street, city: a.city, state: a.state,
                            zipCode: a.zipCode, country: a.country,
                          })
                        }
                        className={`text-left text-xs rounded-lg border px-3 py-2 transition-colors ${
                          shippingAddress.street === a.street && shippingAddress.zipCode === a.zipCode
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="font-medium">{a.label || "Saved address"}</span>
                        <br />
                        <span className="text-muted-foreground">
                          {a.street.slice(0, 28)}{a.street.length > 28 ? "…" : ""}, {a.city}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    placeholder="House/Flat No., Street Name"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="City"
                      required
                    />
            </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="State"
                      required
                    />
          </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      placeholder="Zip Code"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      placeholder="Country"
                      required
                    />
        </div>
      </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="glassmorphism border border-[hsl(var(--border)/0.2)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor="cod" className="font-normal cursor-pointer">
                    Cash on Delivery (COD)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="upi"
                    name="paymentMethod"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor="upi" className="font-normal cursor-pointer">
                    UPI Payment
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="Card"
                    checked={paymentMethod === "Card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-primary"
                  />
                  <Label htmlFor="card" className="font-normal cursor-pointer">
                    Credit/Debit Card
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 glassmorphism border border-[hsl(var(--border)/0.2)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden shrink-0">
                        {item.productImageUrl ? (
                          <Image
                            src={item.productImageUrl}
                            alt={item.productName}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          ₹{item.subtotal.toFixed(2)}
                        </p>
          </div>
        </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm">
                    <span className="flex items-center gap-1.5 text-green-700 font-medium">
                      <TicketPercent className="h-4 w-4" /> {appliedCoupon.code} (−₹{appliedCoupon.discount.toFixed(2)})
                    </span>
                    <button
                      type="button"
                      onClick={() => { setAppliedCoupon(null); setCouponInput(""); }}
                      aria-label="Remove coupon"
                    >
                      <X className="h-4 w-4 text-green-700" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="h-9"
                    />
                    <Button type="button" variant="outline" size="sm" className="h-9" onClick={applyCoupon} disabled={couponBusy || !couponInput.trim()}>
                      {couponBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-700 font-medium">
                      <span>Discount</span>
                      <span>−₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
