
"use client";

import { ShoppingBag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

// Mock cart items - in a real app, this would come from state management
const mockCartItems = [
  { id: '1', name: 'Sunrise Citrus', price: 28, quantity: 1, imageUrl: 'https://picsum.photos/seed/candle1/100/125', scentCategory: 'Citrus' },
  { id: '2', name: 'Lavender Dreams', price: 32, quantity: 2, imageUrl: 'https://picsum.photos/seed/candle2/100/125', scentCategory: 'Floral' },
];

// Set to true to simulate an empty cart, false to show mock items
const isEmpty = false; // Toggle this to test both states. Set to true to see empty cart.

export default function CartPage() {
  const subtotal = isEmpty ? 0 : mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 50 || isEmpty ? 0 : 5.99; // Example: free shipping over $50 or if cart is empty
  const total = subtotal + shippingCost;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-4xl px-4 py-12 md:py-16 min-h-[calc(100vh-var(--navbar-height,4rem))]"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl flex items-center">
          <ShoppingBag className="mr-3 h-8 w-8 text-primary" />
          Your Shopping Cart
        </h1>
        {!isEmpty && mockCartItems.length > 0 && (
            <span className="text-muted-foreground">{mockCartItems.length} item(s)</span>
        )}
      </div>

      {isEmpty ? (
        <Card className="text-center p-10 glassmorphism border border-[hsl(var(--border)/0.2)]">
          <CardHeader className="p-0 items-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-accent mb-4" />
            <CardTitle className="text-2xl">Your Cart is Empty</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any scents to your cart yet.
            </p>
            <Button asChild size="lg" className="btn-primary">
              <Link href="/products">Explore Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="md:col-span-2 space-y-6">
            {mockCartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="flex flex-col sm:flex-row items-center gap-4 p-4 glassmorphism border border-[hsl(var(--border)/0.15)]">
                  <div className="relative h-24 w-20 sm:h-28 sm:w-24 rounded-md overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 80px, 96px"
                      className="object-cover"
                      data-ai-hint={`${item.scentCategory} candle`}
                    />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.scentCategory}</p>
                    <p className="text-md font-semibold text-primary mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-auto">
                    {/* In a real app, quantity controls and remove button would be here */}
                    <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                    <Button variant="outline" size="sm" className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive/50">
                      Remove
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-24 p-6 glassmorphism border border-[hsl(var(--border)/0.2)]">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <Separator className="my-2 bg-border/30" />
                <div className="flex justify-between text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-0 mt-6">
                <Button size="lg" className="w-full btn-primary">
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </motion.div>
  );
}

    