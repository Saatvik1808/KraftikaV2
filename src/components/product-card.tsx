"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Candle } from "@/types/candle";
import { ShoppingCart, Eye, Star, Image as ImageIcon, Sparkles, Leaf, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { addItemToCart } from "@/services/cart-sync";

interface ProductCardProps {
  product: Candle;
  priority?: boolean;
  className?: string;
  showRating?: boolean;
}

const cardVariants = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  hover: {
    scale: 1.01,
    y: -4,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25,
      mass: 0.6
    },
  },
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05, 
    transition: { 
      duration: 0.5, 
      ease: [0.4, 0, 0.2, 1] 
    } 
  },
};

export function ProductCard({ 
  product, 
  priority = false, 
  className = "",
  showRating = true
}: ProductCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  // Prefetch product page on hover for faster navigation
  const handleMouseEnter = () => {
    router.prefetch(`/products/${product.id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await addItemToCart(
        product.id,
        1,
        isAuthenticated,
        () => {
          toast({
            title: "Added to Cart!",
            description: `${product.name} has been added to your cart.`,
            onClick: () => router.push('/cart'),
          });
        },
        (error) => {
          toast({
            title: "Error",
            description: error.message || "Could not add item to cart. Please try again.",
            variant: "destructive",
          });
        }
      );
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onMouseEnter={handleMouseEnter}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl",
        "bg-white dark:bg-gray-900",
        "border border-gray-200/60 dark:border-gray-800/60",
        "shadow-lg hover:shadow-2xl hover:shadow-primary/10",
        "transition-all duration-500",
        className
      )}
    >
      <Link 
        href={`/products/${product.id}`} 
        className="absolute top-0 left-0 right-0 h-[calc(100%-200px)] z-[5]" 
        aria-label={`View details for ${product.name}`}
        prefetch={true}
      />

      {/* Image container with rounded corners */}
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
        <motion.div 
          variants={imageVariants} 
          className="h-full w-full"
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={`${product.name} - ${product.scentCategory} scented candle from Kraftika | Handcrafted soy candle India`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover rounded-t-3xl"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
              <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </motion.div>

        {/* Category badge - top left with better contrast */}
        <div className="absolute top-4 left-4 z-30">
          <Badge 
            className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white backdrop-blur-md shadow-lg px-3 py-1.5 text-xs font-semibold border border-gray-300/80 dark:border-gray-600/80"
          >
            {product.scentCategory}
          </Badge>
        </div>

        {/* New Arrival badge with better visibility */}
        {product.isNew && (
          <div className="absolute top-4 right-4 z-30">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white backdrop-blur-md shadow-lg px-3 py-1.5 text-xs font-semibold border-0 ring-2 ring-white/20">
              <Sparkles className="h-3 w-3 mr-1" />
              New
            </Badge>
          </div>
        )}

        {/* Quick View overlay - appears on hover */}
        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/5 dark:bg-black/10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1 }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl px-6 py-3 shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Eye className="h-4 w-4" />
              Quick View
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product info with improved background for readability */}
      <div className="flex flex-1 flex-col p-6 space-y-4 relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        {/* Product name */}
        <div>
          <h3 className="text-lg font-semibold leading-tight text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating with review count */}
          {showRating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-4 w-4 transition-colors",
                      i < (product?.rating || 4) 
                        ? 'text-amber-500 fill-amber-500' 
                        : 'text-gray-300 dark:text-gray-600'
                    )} 
                  />
                ))}
              </div>
              {(product as any)?.reviewCount && (product as any).reviewCount > 0 ? (
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  ({(product as any).reviewCount} {(product as any).reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              ) : null}
            </div>
          )}
          
          {/* Price - prominent display with better contrast */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">incl. taxes</span>
          </div>
        </div>

        {/* Trust Indicators with better readability */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm">
            <Leaf className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Eco-Friendly</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-sm">
            <Award className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Handcrafted</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-3 pt-2">
          <Button
            size="default"
            className="flex-1 h-11 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            className="h-11 w-11 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200"
            asChild
          >
            <Link href={`/products/${product.id}`} prefetch={true}>
              <Eye className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
