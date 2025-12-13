"use client";

import { CheckCircle2, Package, Truck, Home, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getOrderById } from "@/services/orders-api";
import { PageLoader } from "@/components/ui/loader";
import type { Order, OrderStatus } from "@/types/order";
import Image from "next/image";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }> = {
  PENDING: { label: "Pending", icon: <Package className="h-5 w-5" />, color: "text-yellow-600" },
  CONFIRMED: { label: "Confirmed", icon: <CheckCircle2 className="h-5 w-5" />, color: "text-blue-600" },
  SHIPPED: { label: "Shipped", icon: <Truck className="h-5 w-5" />, color: "text-purple-600" },
  DELIVERED: { label: "Delivered", icon: <CheckCircle2 className="h-5 w-5" />, color: "text-green-600" },
  CANCELLED: { label: "Cancelled", icon: <Package className="h-5 w-5" />, color: "text-red-600" },
};

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Validate params.id exists
    if (!params.id || params.id === 'undefined') {
      toast({
        title: "Invalid Order ID",
        description: "The order ID is missing or invalid.",
        variant: "destructive",
      });
      router.push("/orders");
      return;
    }

    const loadOrder = async () => {
      try {
        setIsLoading(true);
        const orderData = await getOrderById(params.id);
        if (!orderData) {
          toast({
            title: "Order Not Found",
            description: "The order you're looking for doesn't exist.",
            variant: "destructive",
          });
          router.push("/orders");
          return;
        }
        setOrder(orderData);
      } catch (error: any) {
        console.error("Failed to load order:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load order details.",
          variant: "destructive",
        });
        router.push("/orders");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [params.id, router, toast]);

  if (isLoading) {
    return <PageLoader text="Loading order details..." />;
  }

  if (!order) {
    return null;
  }

  const statusInfo = statusConfig[order.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-4xl px-4 py-12"
    >
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Order Confirmation
        </h1>
      </div>

      {/* Success Message */}
      <Card className="mb-6 glassmorphism border border-[hsl(var(--border)/0.2)]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className={`${statusInfo.color} flex-shrink-0`}>
              {statusInfo.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold">Order #{order.id.slice(0, 8)}</h2>
              <p className="text-muted-foreground">
                Status: <span className={`font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="glassmorphism border border-[hsl(var(--border)/0.2)]">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ₹{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{typeof item.subtotal === 'number' ? item.subtotal.toFixed(2) : item.subtotal}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="glassmorphism border border-[hsl(var(--border)/0.2)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typeof order.shippingAddress === 'object' && order.shippingAddress ? (
                <div className="space-y-1">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country || 'India'}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Address not available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-24 glassmorphism border border-[hsl(var(--border)/0.2)]">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="capitalize">{order.paymentMethod || 'COD'}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : order.totalAmount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

