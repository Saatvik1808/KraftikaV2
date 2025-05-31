
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import { Button } from "@/components/ui/button";
import { HeartCrack, ShoppingBag } from "lucide-react"; // HeartCrack for empty wishlist
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample Product Data - In a real app, fetch this based on ID or have a global store
const allProducts: Candle[] = [
    { id: '1', name: 'Sunrise Citrus', scentCategory: 'Citrus', price: 28, imageUrl: 'https://images.unsplash.com/photo-1697587454797-8644fcb7e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjaXRydXMlMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Awaken your senses with the bright and zesty aroma of freshly squeezed lemons and sweet oranges, reminiscent of a sun-drenched morning.', scentNotes: 'Top: Lemon Peel, Bergamot | Middle: Sweet Orange, Neroli | Base: Cedarwood', burnTime: 'Approx. 40-45 hours', ingredients: '100% Natural Soy Wax, Premium Essential Oils, Cotton Wick' },
    { id: '2', name: 'Lavender Dreams', scentCategory: 'Floral', price: 32, imageUrl: 'https://images.unsplash.com/photo-1619799360851-a143fbc240b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmbG9yYWwlMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Drift into tranquility with the soothing scent of French lavender, blended with calming chamomile and a hint of warm vanilla.', scentNotes: 'Top: Lavender | Middle: Chamomile, Sage | Base: Vanilla, Sandalwood', burnTime: 'Approx. 45-50 hours', ingredients: 'Natural Soy Wax Blend, Natural Fragrance Oils, Cotton Wick' },
    { id: '3', name: 'Vanilla Bean Bliss', scentCategory: 'Sweet', price: 30, imageUrl: 'https://images.unsplash.com/photo-1604249180535-583716d9ec33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzd2VldCUyMGNhbmRsZXxlbnwwfHx8fDE3NDg2OTE1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Indulge in the comforting and rich fragrance of pure vanilla bean, enhanced with notes of sweet buttercream and a touch of caramel.', scentNotes: 'Top: Buttercream | Middle: Vanilla Bean, Cake | Base: Sugar, Bourbon', burnTime: 'Approx. 50-55 hours', ingredients: 'Coconut & Soy Wax Blend, Phthalate-Free Fragrance Oils, Wooden Wick' },
    { id: '4', name: 'Mint Mojito', scentCategory: 'Fresh', price: 29, imageUrl: 'https://images.unsplash.com/photo-1645602996177-e30e95e58c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmcmVzaCUyMGNhbmRsZXxlbnwwfHx8fDE3NDg2OTE1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'A refreshing and invigorating blend of cool spearmint, zesty lime, and a touch of sweetness, like a perfectly crafted mojito.', scentNotes: 'Top: Lime, Mint | Middle: Jasmine, Pineapple | Base: Rum, Sugar', burnTime: 'Approx. 40-45 hours', ingredients: '100% Natural Soy Wax, Essential Oils, Cotton Wick' },
    { id: '5', name: 'Rose Garden', scentCategory: 'Floral', price: 35, imageUrl: 'https://images.unsplash.com/photo-1619799360851-a143fbc240b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmbG9yYWwlMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Stroll through a blooming garden with the delicate and romantic aroma of fresh-cut roses and soft geranium petals.', scentNotes: 'Top: Rose Petals, Green Leaves | Middle: Geranium, Violet | Base: Musk, Floral Musk', burnTime: 'Approx. 45-50 hours', ingredients: 'Natural Soy Wax Blend, Natural Fragrance Oils, Cotton Wick' },
    { id: '6', name: 'Spiced Apple', scentCategory: 'Fruity', price: 31, imageUrl: 'https://images.unsplash.com/photo-1625055887171-4a3186a42b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmcnVpdHklMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Cozy up with the warm and inviting scent of baked apples dusted with spicy cinnamon and a hint of clove.', scentNotes: 'Top: Red Apple, Orange Peel | Middle: Cinnamon, Clove, Nutmeg | Base: Vanilla, Pie Crust', burnTime: 'Approx. 48-52 hours', ingredients: 'Soy Wax Blend, Phthalate-Free Fragrance Oils, Cotton Wick' },
    { id: '7', name: 'Ocean Breeze', scentCategory: 'Fresh', price: 33, imageUrl: 'https://images.unsplash.com/photo-1499950617211-a8609a16ad72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZnJlc2glMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Capture the essence of a coastal getaway with this crisp blend of sea salt, ozonic air, and hints of floral notes.', scentNotes: 'Top: Ozone, Sea Salt | Middle: Jasmine, Lily of the Valley | Base: Wood, Tonka Bean', burnTime: 'Approx. 42-48 hours', ingredients: 'Soy Wax, Phthalate-Free Fragrance Oils, Cotton Wick' },
    { id: '8', name: 'Peach Paradise', scentCategory: 'Fruity', price: 27, imageUrl: 'https://images.unsplash.com/photo-1603959452586-78397d087b62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZnJ1aXR5JTIwY2FuZGxlfGVufDB8fHx8MTc0ODY5MTUwNHww&ixlib=rb-4.1.0&q=80&w=1080', description: 'Escape to a tropical oasis with the sweet and juicy fragrance of ripe peaches, blended with exotic mango and creamy coconut.', scentNotes: 'Top: Ripe Peach, Bergamot | Middle: Mango, Coconut | Base: Vanilla, Sugar', burnTime: 'Approx. 38-42 hours', ingredients: 'Soy Wax, Phthalate-Free Fragrance Oils, Cotton Wick' },
];

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
  const [wishlistItems, setWishlistItems] = React.useState<Candle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

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
          setWishlistItems([]); // Fallback to empty if parsing fails
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
          {wishlistItems.map((product) => (
            <motion.div key={product.id} variants={itemVariants} layout>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
