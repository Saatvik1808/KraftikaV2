
"use client";

import { ShoppingBag, AlertTriangle, Trash2 } from "lucide-react"; // Added Trash2
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import * as React from "react"; // Import React
import type { Candle } from "@/types/candle"; // Import Candle type
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Extend Candle type for cart items to include quantity
interface CartItem extends Candle {
  quantity: number;
}

// Mock cart items - in a real app, this would come from state management or context
const initialMockCartItems: CartItem[] = [
  { id: '1', name: 'Sunrise Citrus', price: 28, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1697587454797-8644fcb7e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjaXRydXMlMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=100', scentCategory: 'Citrus', description: '', scentNotes: '', burnTime: '', ingredients: '' },
  { id: '2', name: 'Lavender Dreams', price: 32, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1619799360851-a143fbc240b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmbG9yYWwlMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=100', scentCategory: 'Floral', description: '', scentNotes: '', burnTime: '', ingredients: '' },
];


export default function CartPage() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>(initialMockCartItems);
  const { toast } = useToast();

  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = cartItems.find(item => item.id === itemId);
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    if (itemToRemove) {
      toast({
        title: "Item Removed",
        description: `${itemToRemove.name} has been removed from your cart.`,
      });
    }
  };

  const isEmpty = cartItems.length === 0;
  const subtotal = isEmpty ? 0 : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 50 || isEmpty ? 0 : 5.99;
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
        {!isEmpty && cartItems.length > 0 && (
            <span className="text-muted-foreground">{cartItems.reduce((acc, item) => acc + item.quantity, 0)} item(s)</span>
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
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                layout // Add layout prop for smooth removal animation
              >
                <Card className="flex flex-col sm:flex-row items-center gap-4 p-4 glassmorphism border border-[hsl(var(--border)/0.15)]">
                  <div className="relative h-24 w-20 sm:h-28 sm:w-24 rounded-md overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 80px, 96px"
                      className="object-cover"
                      data-ai-hint={`${item.scentCategory.toLowerCase()} candle`}
                    />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.scentCategory}</p>
                    <p className="text-md font-semibold text-primary mt-1">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-auto">
                    <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon" // Changed size to icon
                      className="text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive/50 h-8 w-8" // Adjusted styling for icon button
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
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
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                <Separator className="my-2 bg-border/30" />
                <div className="flex justify-between text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
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
