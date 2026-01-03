
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { WishlistCard } from "@/components/wishlist-card";
import type { Candle } from "@/types/candle";
import { Button } from "@/components/ui/button";
import { HeartCrack, ShoppingBag, ShoppingCart, Sparkles } from "lucide-react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/services/products-unified";
import { PageLoader } from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { addItemToCart } from "@/services/cart-sync";
import { trackAddToCart } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
};


export default function WishlistPage() {
  const [allProducts, setAllProducts] = React.useState<Candle[]>([]);
  const [wishlistItems, setWishlistItems] = React.useState<Candle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddingAll, setIsAddingAll] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Fetch products from Firestore
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update wishlist items when products are loaded or wishlist changes
  React.useEffect(() => {
    if (typeof window !== 'undefined' && allProducts.length > 0) {
      const storedWishlistIds = localStorage.getItem('kraftikaWishlist');
      if (storedWishlistIds) {
        try {
          const ids: string[] = JSON.parse(storedWishlistIds);
          const likedProducts = allProducts.filter(product => ids.includes(product.id));
          setWishlistItems(likedProducts);
        } catch (error) {
          console.error("Error parsing wishlist from localStorage", error);
          setWishlistItems([]); 
        }
      } else {
        setWishlistItems([]);
      }
      setIsLoading(false);
    }
  }, [allProducts]);

  // Listen for wishlist updates from other pages
  React.useEffect(() => {
    if (typeof window === 'undefined' || allProducts.length === 0) return;

    const handleWishlistUpdate = () => {
      const storedWishlistIds = localStorage.getItem('kraftikaWishlist');
      if (storedWishlistIds) {
        try {
          const ids: string[] = JSON.parse(storedWishlistIds);
          const likedProducts = allProducts.filter(product => ids.includes(product.id));
          setWishlistItems(likedProducts);
        } catch (error) {
          console.error("Error parsing wishlist from localStorage", error);
          setWishlistItems([]);
        }
      } else {
        setWishlistItems([]);
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [allProducts]);

  // Remove item from wishlist
  const handleRemoveFromWishlist = (productId: string) => {
    if (typeof window === 'undefined') return;
    
    const storedWishlistIds = localStorage.getItem('kraftikaWishlist');
    if (storedWishlistIds) {
      try {
        const ids: string[] = JSON.parse(storedWishlistIds);
        const updatedIds = ids.filter(id => id !== productId);
        localStorage.setItem('kraftikaWishlist', JSON.stringify(updatedIds));
        
        // Update local state
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      } catch (error) {
        console.error("Error removing from wishlist", error);
      }
    }
  };

  // Add all items to cart
  const handleAddAllToCart = async () => {
    if (wishlistItems.length === 0) return;
    
    setIsAddingAll(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const product of wishlistItems) {
        try {
          await addItemToCart(
            product.id,
            1,
            isAuthenticated,
            () => {
              trackAddToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                category: product.scentCategory,
              });
              successCount++;
            },
            () => {
              errorCount++;
            }
          );
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Items Added to Cart!",
          description: `${successCount} item${successCount > 1 ? 's' : ''} added to your cart.`,
          onClick: () => router.push('/cart'),
        });
        router.push('/cart');
      }

      if (errorCount > 0) {
        toast({
          title: "Some items couldn't be added",
          description: `${errorCount} item${errorCount > 1 ? 's' : ''} failed to add.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding items to cart:", error);
      toast({
        title: "Error",
        description: "Could not add items to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingAll(false);
    }
  };

  if (isLoading) {
    return <PageLoader text="Loading your wishlist..." />;
  }

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-[calc(100vh-var(--navbar-height,4rem))] bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                Your Wishlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {wishlistItems.length > 0 
                  ? `${wishlistItems.length} item${wishlistItems.length > 1 ? 's' : ''} saved • Total: ₹${totalValue.toFixed(2)}`
                  : "Save your favorite scents for later"
                }
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <div className="flex gap-3">
                <Button
                  size="lg"
                  onClick={handleAddAllToCart}
                  disabled={isAddingAll}
                  className="font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isAddingAll ? "Adding..." : "Add All to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="font-semibold"
                >
                  <Link href="/products">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Wishlist Content */}
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <Card className="max-w-md mx-auto text-center p-8 md:p-12 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
              <CardHeader className="p-0 items-center mb-6">
                <div className="mx-auto mb-4 p-4 rounded-full bg-pink-50 dark:bg-pink-950/20 w-fit">
                  <HeartCrack className="h-12 w-12 text-pink-400 dark:text-pink-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Wishlist is Empty
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  Looks like you haven't added any favorite scents yet. Start exploring to find candles you'll love!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg" className="font-semibold">
                    <Link href="/products">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Explore Products
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Reminder message */}
            {wishlistItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30"
              >
                <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Almost yours!</span> Add these items to your cart to complete your purchase.
                </p>
              </motion.div>
            )}

            {/* Product Grid */}
            <AnimatePresence mode="popLayout">
              <motion.div
                className={cn(
                  "grid gap-6",
                  wishlistItems.length === 1 
                    ? "grid-cols-1 max-w-md mx-auto"
                    : wishlistItems.length === 2
                    ? "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {wishlistItems.map((product, index) => (
                  <WishlistCard
                    key={product.id}
                    product={product}
                    onRemove={handleRemoveFromWishlist}
                    priority={index < 4}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
