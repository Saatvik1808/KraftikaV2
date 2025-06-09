
"use client";

import { ShoppingBag, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import * as React from "react";
import type { Candle } from "@/types/candle";
import { useToast } from "@/hooks/use-toast";
import allProductsData from "@/data/products.json"; // Import the centralized product data

// Define Candle and CartItem types consistent with other parts of the app
interface CartItem extends Candle {
  quantity: number;
}

interface CartStorageItem {
  id: string;
  quantity: number;
}

const allProducts: Candle[] = allProductsData;

export default function CartPage() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const whatsappCheckoutLink = "https://wa.me/9625901437";

  React.useEffect(() => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      try {
        const cartString = localStorage.getItem('kraftikaCart');
        const storedCartItems: CartStorageItem[] = cartString ? JSON.parse(cartString) : [];
        
        const hydratedCartItems = storedCartItems.map(storedItem => {
          const productDetails = allProducts.find(p => p.id === storedItem.id);
          if (productDetails) {
            return { ...productDetails, quantity: storedItem.quantity };
          }
          return null; 
        }).filter(item => item !== null) as CartItem[];
        
        setCartItems(hydratedCartItems);
      } catch (error) {
        console.error("Failed to load cart from localStorage", error);
        setCartItems([]); // Fallback to empty cart on error
      }
    }
    setIsLoading(false);
  }, []);

  const handleDecreaseQuantityOrRemove = (itemId: string) => {
    let itemUpdated = false;
    let itemRemoved = false;
    let itemName = "";

    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        itemName = item.name;
        if (item.quantity > 1) {
          itemUpdated = true;
          return { ...item, quantity: item.quantity - 1 };
        } else {
          itemRemoved = true;
          return null; // Mark for removal
        }
      }
      return item;
    }).filter(item => item !== null) as CartItem[];

    setCartItems(updatedCartItems);

    try {
      const updatedStorageCart = updatedCartItems.map(item => ({ id: item.id, quantity: item.quantity }));
      localStorage.setItem('kraftikaCart', JSON.stringify(updatedStorageCart));
    } catch (error) {
      console.error("Failed to update cart in localStorage", error);
    }

    if (itemRemoved) {
      toast({
        title: "Item Removed",
        description: `${itemName} has been removed from your cart.`,
      });
    } else if (itemUpdated) {
      const currentItem = updatedCartItems.find(i => i.id === itemId);
      toast({
        title: "Quantity Updated",
        description: `Quantity for ${itemName} is now ${currentItem?.quantity || 0}.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16 min-h-[calc(100vh-var(--navbar-height,4rem))] flex justify-center items-center">
        <p>Loading your cart...</p>
      </div>
    );
  }

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
                layout 
              >
                <Card className="flex flex-col sm:flex-row items-center gap-4 p-4 glassmorphism border border-[hsl(var(--border)/0.15)]">
                  <div className="relative h-24 w-20 sm:h-28 sm:w-24 rounded-md overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 80px, 96px"
                      className="object-cover"
                      data-ai-hint="handcrafted candle"
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
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive/50 h-8 w-8"
                      onClick={() => handleDecreaseQuantityOrRemove(item.id)}
                      aria-label={`Decrease quantity or remove ${item.name} from cart`}
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
                <Button asChild size="lg" className="w-full btn-primary">
                  <Link href={whatsappCheckoutLink} target="_blank" rel="noopener noreferrer">
                    Proceed to Checkout
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </motion.div>
  );
}
