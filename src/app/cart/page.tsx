"use client";

import { ShoppingBag, Trash2, Image as ImageIcon, Plus, Minus, ArrowRight, Truck, ShieldCheck, Undo2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import * as React from "react";
import type { Candle } from "@/types/candle";
import { useToast } from "@/hooks/use-toast";
import { getProducts } from "@/services/products-unified";
import { useAuth } from "@/contexts/AuthContext";
import { cartApi } from "@/services/cart-api";
import { PageLoader } from "@/components/ui/loader";
import { trackBeginCheckout, trackRemoveFromCart } from "@/lib/analytics";

// Define Candle and CartItem types consistent with other parts of the app
interface CartItem extends Candle {
  quantity: number;
}

interface CartStorageItem {
  id: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null); // Track which item is being updated
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  // Load cart items
  const loadCart = React.useCallback(async () => {
    try {
      setIsLoading(true);
      let loadedCartItems: CartItem[] = [];
      
      if (isAuthenticated) {
        // Load from backend API
        try {
          const backendCart = await cartApi.getCart();
          // Backend returns cart items with all product data
          loadedCartItems = backendCart.map((backendItem: any) => {
            const price = typeof backendItem.price === 'string' 
              ? parseFloat(backendItem.price) 
              : (typeof backendItem.price === 'number' ? backendItem.price : 0);
            
            return {
              id: backendItem.productId,
              name: backendItem.productName || '',
              description: backendItem.productDescription || '',
              price: price,
              imageUrl: backendItem.productImageUrl || '',
              scentCategory: backendItem.scentCategory || '',
              scentNotes: backendItem.scentNotes || '',
              burnTime: backendItem.burnTime || '',
              ingredients: backendItem.ingredients || '',
              popularity: 0,
              createdAt: new Date().toISOString(),
              quantity: backendItem.quantity || 1,
            } as CartItem;
          }).filter((item: CartItem) => item.id && item.name) as CartItem[];
        } catch (error: any) {
          // If auth failed, fall back to localStorage
          if (error.message === "NOT_AUTHENTICATED") {
            console.log("Not authenticated, loading from localStorage");
            const products = await getProducts();
            const cartString = localStorage.getItem('kraftikaCart');
            const storedCartItems: CartStorageItem[] = cartString ? JSON.parse(cartString) : [];
            loadedCartItems = storedCartItems.map(storedItem => {
              const productDetails = products.find(p => p.id === storedItem.id);
              if (productDetails) {
                return { ...productDetails, quantity: storedItem.quantity };
              }
              return null;
            }).filter(item => item !== null) as CartItem[];
          } else {
            throw error;
          }
        }
      } else {
        // Load from localStorage
        const products = await getProducts();
        const cartString = localStorage.getItem('kraftikaCart');
        const storedCartItems: CartStorageItem[] = cartString ? JSON.parse(cartString) : [];
        
        loadedCartItems = storedCartItems.map(storedItem => {
          const productDetails = products.find(p => p.id === storedItem.id);
          if (productDetails) {
            return { ...productDetails, quantity: storedItem.quantity };
          }
          return null;
        }).filter(item => item !== null) as CartItem[];
      }
      
      setCartItems(loadedCartItems);
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCartItems([]);
      toast({ 
        title: "Error", 
        description: "Could not load your cart.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, toast]);

  React.useEffect(() => {
    loadCart();
    
    // Listen for cart updates (e.g., when items are added from product page)
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [loadCart]);

  // Update quantity
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;

    setIsUpdating(itemId);

    try {
      if (isAuthenticated) {
        // Update via backend API
        const backendCart = await cartApi.updateItem(itemId, newQuantity);
        
        // Map backend response directly - it has all product data
        const updatedCartItems = backendCart.map((backendItem: any) => {
          const price = typeof backendItem.price === 'string' 
            ? parseFloat(backendItem.price) 
            : (typeof backendItem.price === 'number' ? backendItem.price : 0);
          
          return {
            id: backendItem.productId,
            name: backendItem.productName || '',
            description: backendItem.productDescription || '',
            price: price,
            imageUrl: backendItem.productImageUrl || '',
            scentCategory: backendItem.scentCategory || '',
            scentNotes: backendItem.scentNotes || '',
            burnTime: backendItem.burnTime || '',
            ingredients: backendItem.ingredients || '',
            popularity: 0,
            createdAt: new Date().toISOString(),
            quantity: backendItem.quantity || 1,
          } as CartItem;
        }).filter((item: CartItem) => item.id && item.name) as CartItem[];
        
        setCartItems(updatedCartItems);
        toast({
          title: "Quantity Updated",
          description: `${item.name} quantity updated to ${newQuantity}.`,
        });
      } else {
        // Update localStorage
        const updatedCartItems = cartItems.map(cartItem => {
          if (cartItem.id === itemId) {
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        });

        setCartItems(updatedCartItems);
        const updatedStorageCart = updatedCartItems.map(item => ({ 
          id: item.id, 
          quantity: item.quantity 
        }));
        localStorage.setItem('kraftikaCart', JSON.stringify(updatedStorageCart));
        
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        toast({
          title: "Quantity Updated",
          description: `${item.name} quantity updated to ${newQuantity}.`,
        });
      }
    } catch (error: any) {
      console.error("Failed to update quantity:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
      // Reload cart on error
      loadCart();
    } finally {
      setIsUpdating(null);
    }
  };

  // Remove item
  const handleRemoveItem = async (itemId: string) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item) {
      console.warn("Item not found in cart:", itemId);
      return;
    }

    const itemName = item.name;
    setIsUpdating(itemId);

    try {
      if (isAuthenticated) {
        // Remove via backend API
        console.log('[Cart Page] Removing item:', itemId);
        const backendCart = await cartApi.removeItem(itemId);
        console.log('[Cart Page] Backend cart response:', backendCart);
        
        // Handle empty cart (all items removed)
        if (!backendCart || backendCart.length === 0) {
          console.log('[Cart Page] Cart is now empty');
          setCartItems([]);
          toast({
            title: "Item Removed",
            description: `${itemName} has been removed from your cart.`,
          });
          return;
        }
        
        // Map backend response directly - it has all product data
        const updatedCartItems = backendCart.map((backendItem: any) => {
          const price = typeof backendItem.price === 'string' 
            ? parseFloat(backendItem.price) 
            : (typeof backendItem.price === 'number' ? backendItem.price : 0);
          
          const mappedItem = {
            id: backendItem.productId,
            name: backendItem.productName || '',
            description: backendItem.productDescription || '',
            price: price,
            imageUrl: backendItem.productImageUrl || '',
            scentCategory: backendItem.scentCategory || '',
            scentNotes: backendItem.scentNotes || '',
            burnTime: backendItem.burnTime || '',
            ingredients: backendItem.ingredients || '',
            popularity: 0,
            createdAt: new Date().toISOString(),
            quantity: backendItem.quantity || 1,
          } as CartItem;
          
          return mappedItem;
        }).filter((item: CartItem) => item && item.id && item.name) as CartItem[];
        
        console.log('[Cart Page] Mapped cart items:', updatedCartItems);
        console.log('[Cart Page] Previous cart items count:', cartItems.length);
        console.log('[Cart Page] New cart items count:', updatedCartItems.length);
        console.log('[Cart Page] Item IDs in response:', updatedCartItems.map(i => i.id));
        console.log('[Cart Page] Removed item ID:', itemId);
        
        // Update state immediately with new array
        setCartItems(updatedCartItems);
        
        // Track remove from cart
        trackRemoveFromCart({
          id: item.id,
          name: itemName,
          price: item.price,
          quantity: item.quantity,
        });
        
        toast({
          title: "Item Removed",
          description: `${itemName} has been removed from your cart.`,
        });
        
        // Reload cart immediately to ensure UI matches backend exactly
        // This ensures any edge cases are handled
        await loadCart();
      } else {
        // Remove from localStorage
        const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== itemId);
        setCartItems(updatedCartItems);
        const updatedStorageCart = updatedCartItems.map(item => ({ 
          id: item.id, 
          quantity: item.quantity 
        }));
        localStorage.setItem('kraftikaCart', JSON.stringify(updatedStorageCart));
        
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        // Track remove from cart
        trackRemoveFromCart({
          id: item.id,
          name: itemName,
          price: item.price,
          quantity: item.quantity,
        });
        
        toast({
          title: "Item Removed",
          description: `${itemName} has been removed from your cart.`,
        });
      }
    } catch (error: any) {
      console.error("Failed to remove item:", error);
      const errorMessage = error?.message || "Failed to remove item. Please try again.";
      
      // If it's an auth error, try localStorage fallback
      if (error?.message === "NOT_AUTHENTICATED" && isAuthenticated) {
        console.log("Auth failed, falling back to localStorage removal");
        try {
          const updatedCartItems = cartItems.filter(cartItem => cartItem.id !== itemId);
          setCartItems(updatedCartItems);
          const updatedStorageCart = updatedCartItems.map(item => ({ 
            id: item.id, 
            quantity: item.quantity 
          }));
          localStorage.setItem('kraftikaCart', JSON.stringify(updatedStorageCart));
          window.dispatchEvent(new CustomEvent('cartUpdated'));
          toast({
            title: "Item Removed",
            description: `${itemName} has been removed from your cart.`,
          });
          return;
        } catch (fallbackError) {
          console.error("Fallback removal also failed:", fallbackError);
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      // Always reload cart on error to sync state
      await loadCart();
    } finally {
      setIsUpdating(null);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading your cart..." />;
  }

  const isEmpty = cartItems.length === 0;
  const subtotal = isEmpty ? 0 : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const FREE_SHIPPING_AT = 500;
  const shippingCost = subtotal > FREE_SHIPPING_AT || isEmpty ? 0 : 50; // Free shipping above ₹500
  const total = subtotal + shippingCost;
  const freeShippingGap = Math.max(0, FREE_SHIPPING_AT - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100);

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
          <span className="text-muted-foreground">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} item(s)
          </span>
        )}
      </div>

      {isEmpty ? (
        <Card className="text-center p-12 glassmorphism border border-[hsl(var(--border)/0.2)]">
          <CardHeader className="p-0 items-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/40">
              <ShoppingBag className="h-9 w-9 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">Your cart is waiting to be filled</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-muted-foreground mb-7 max-w-sm mx-auto">
              Discover hand-poured soy candles that turn any evening into a warm one.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md">
              <Link href="/products">Explore Candles <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
                <Card className="flex flex-col sm:flex-row items-center gap-4 p-4 glassmorphism border border-[hsl(var(--border)/0.15)] candle-card">
                  <Link href={`/products/${item.id}`} className="relative h-24 w-20 sm:h-28 sm:w-24 rounded-lg overflow-hidden shrink-0 group/img">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 80px, 96px"
                        className="object-cover transition-transform duration-500 group-hover/img:scale-105"
                        data-ai-hint="handcrafted candle"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </Link>
                  <div className="flex-grow text-center sm:text-left">
                    <Link href={`/products/${item.id}`} className="hover:text-amber-700 transition-colors">
                      <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                    </Link>
                    {item.scentCategory && (
                      <span className="inline-block text-xs font-medium text-amber-700 bg-secondary/50 rounded-full px-2 py-0.5 mt-1">
                        {item.scentCategory}
                      </span>
                    )}
                    <p className="text-sm text-muted-foreground mt-1.5">
                      ₹{item.price.toFixed(2)} × {item.quantity} ={" "}
                      <span className="font-semibold text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0 sm:ml-auto">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 border border-border rounded-full bg-card/60 px-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={isUpdating === item.id}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={isUpdating === item.id}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Remove Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 border-destructive/30 hover:border-destructive/50 h-8 w-8"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isUpdating === item.id}
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
                {/* Free shipping nudge */}
                {freeShippingGap > 0 ? (
                  <div className="rounded-lg bg-secondary/30 border border-secondary p-3">
                    <p className="text-sm font-medium flex items-center gap-1.5 mb-2">
                      <Truck className="h-4 w-4 text-amber-700" />
                      Add <span className="font-bold text-amber-700">₹{freeShippingGap.toFixed(0)}</span> more for FREE shipping
                    </p>
                    <div className="h-2 w-full rounded-full bg-border/60 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                    <p className="text-sm font-medium text-green-700 flex items-center gap-1.5">
                      <PartyPopper className="h-4 w-4" /> You've unlocked FREE shipping!
                    </p>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
                </div>
                <Separator className="my-2 bg-border/30" />
                <div className="flex justify-between text-lg font-semibold text-foreground">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Have a coupon? Apply it at checkout.
                </p>
              </CardContent>
              <CardFooter className="p-0 mt-6 flex-col gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-[0_0_24px_-4px_rgba(251,146,60,0.6)] transition-all"
                  onClick={() => {
                    // Track begin checkout
                    trackBeginCheckout(
                      cartItems.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        category: item.scentCategory,
                      })),
                      total
                    );
                  }}
                >
                  <Link href="/payment">
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-amber-700 transition-colors">
                  ← Continue shopping
                </Link>
                <div className="w-full grid grid-cols-3 gap-1 pt-3 border-t border-border/50 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-amber-700" />
                    <span className="text-[11px] text-muted-foreground leading-tight">Secure payments</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="h-4 w-4 text-amber-700" />
                    <span className="text-[11px] text-muted-foreground leading-tight">COD available</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Undo2 className="h-4 w-4 text-amber-700" />
                    <span className="text-[11px] text-muted-foreground leading-tight">7-day returns</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </motion.div>
  );
}
