
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import { Button } from "@/components/ui/button";
import { HeartCrack, ShoppingBag } from "lucide-react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/services/products";

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

  // Fetch products from Firestore
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
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
      }
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16 text-center min-h-[calc(100vh-var(--navbar-height,4rem))] flex items-center justify-center">
        Loading your wishlist...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-7xl px-4 py-12 md:py-16 min-h-[calc(100vh-var(--navbar-height,4rem))]"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 text-center text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent filter brightness-80 sm:text-5xl"
      >
        Your Wishlist
      </motion.h1>

      {wishlistItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center py-10"
        >
          <Card className="max-w-lg mx-auto text-center p-10 glassmorphism border border-[hsl(var(--border)/0.2)]">
            <CardHeader className="p-0 items-center">
              <HeartCrack className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
              <CardTitle className="text-2xl text-foreground/90">Your Wishlist is Empty</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any favorite scents yet. Start exploring to find candles you'll love!
              </p>
              <Button asChild size="lg" className="btn-primary">
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" /> Explore Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {wishlistItems.map((product, index) => ( // Added index
            <motion.div key={product.id} variants={itemVariants} layout>
              <ProductCard product={product} priority={index < 4} /> {/* Prioritize first 4 images */}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
