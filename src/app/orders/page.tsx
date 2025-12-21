"use client";

import { Package, CheckCircle2, Truck, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getAllOrders } from "@/services/orders-api";
import { PageLoader } from "@/components/ui/loader";
import type { Order, OrderStatus } from "@/types/order";

const statusConfig: Record<OrderStatus, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  PENDING: { 
    label: "Pending", 
    icon: <Package className="h-4 w-4" />, 
    color: "text-yellow-700", 
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20" 
  },
  CONFIRMED: { 
    label: "Confirmed", 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    color: "text-blue-700", 
    bgColor: "bg-blue-50 dark:bg-blue-900/20" 
  },
  SHIPPED: { 
    label: "Shipped", 
    icon: <Truck className="h-4 w-4" />, 
    color: "text-purple-700", 
    bgColor: "bg-purple-50 dark:bg-purple-900/20" 
  },
  DELIVERED: { 
    label: "Delivered", 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    color: "text-green-700", 
    bgColor: "bg-green-50 dark:bg-green-900/20" 
  },
  CANCELLED: { 
    label: "Cancelled", 
    icon: <XCircle className="h-4 w-4" />, 
    color: "text-red-700", 
    bgColor: "bg-red-50 dark:bg-red-900/20" 
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/orders");
      return;
    }

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const ordersData = await getAllOrders(user?.id);
        setOrders(ordersData);
      } catch (error: any) {
        console.error("Failed to load orders:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load orders.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, user, router, toast]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <PageLoader text="Loading your orders..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-6xl px-4 py-12"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          My Orders
        </h1>
        <p className="text-muted-foreground mt-2">
          Track and manage your orders
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center p-10 glassmorphism border border-[hsl(var(--border)/0.2)]">
          <CardHeader className="p-0 items-center">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Orders Yet</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button asChild size="lg" className="btn-primary">
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => {
            const statusInfo = statusConfig[order.status];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="glassmorphism border border-[hsl(var(--border)/0.2)] hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            Order #{order.id.slice(0, 8)}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color} ${statusInfo.bgColor}`}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {order.orderItems.length} item(s) • Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <div className="flex flex-wrap gap-2 text-sm">
                          {order.orderItems.slice(0, 3).map((item) => (
                            <span key={item.id} className="text-muted-foreground">
                              {item.productName} (×{item.quantity})
                            </span>
                          ))}
                          {order.orderItems.length > 3 && (
                            <span className="text-muted-foreground">
                              +{order.orderItems.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-xl font-bold">
                          ₹{typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : order.totalAmount}
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/orders/${order.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}



