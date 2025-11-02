"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Candle } from "@/types/candle";
import { ShoppingCart, Star, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { addItemToCart } from "@/services/cart-sync";

interface ShowcaseProductCardProps {
  product: Candle;
  priority?: boolean;
  className?: string;
}

const cardVariants = {
  rest: {
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  hover: {
    scale: 1.04,
    y: -12,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25,
      duration: 0.6
    },
  },
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94] 
    } 
  },
};

export function ShowcaseProductCard({ 
  product, 
  priority = false, 
  className = ""
}: ShowcaseProductCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
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
        "bg-gradient-to-br from-white via-white to-primary/5",
        "dark:from-gray-900 dark:via-gray-900 dark:to-primary/10",
        "border border-primary/20 dark:border-primary/30",
        "shadow-lg hover:shadow-2xl hover:shadow-primary/20",
        "backdrop-blur-sm transition-all duration-500",
        "w-full h-full",
        className
      )}
      style={{ opacity: 1, visibility: 'visible' }}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Image container with elegant styling */}
      <div className="relative overflow-hidden aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <motion.div 
          variants={imageVariants} 
          className="h-full w-full relative"
        >
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={`${product.name} - ${product.scentCategory} scented candle`}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
              className="object-cover"
              priority={priority}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
        </motion.div>

        {/* Elegant overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category badge - repositioned */}
        <div className="absolute top-4 right-4 z-40 pointer-events-none">
          <Badge 
            variant="secondary" 
            className="bg-white/95 dark:bg-gray-900/95 text-primary backdrop-blur-md shadow-lg px-3 py-1.5 text-xs font-semibold border border-primary/20"
          >
            {product.scentCategory}
          </Badge>
        </div>

        {/* Price overlay - bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl p-3 shadow-xl border border-primary/20">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-primary">
                ₹{product.price.toFixed(0)}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-muted-foreground">
                {(product as any)?.rating || 4.5}
              </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product info section - elegantly styled */}
      <div className="relative p-5 bg-gradient-to-b from-white/90 to-white dark:from-gray-900/90 dark:to-gray-900 backdrop-blur-sm z-50">
        <div className="space-y-2 relative z-50">
          {/* Product name */}
          <Link href={`/products/${product.id}`} className="block relative z-50">
            <h3 className="text-lg font-bold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
          </Link>

          {/* Rating - compact */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-3.5 w-3.5 transition-all",
                    i < ((product as any)?.rating || 4) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300 dark:text-gray-600'
                  )} 
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({(product as any)?.reviewCount || 24} reviews)
            </span>
          </div>
        </div>

        {/* Action button - elegant and prominent */}
        <div className="mt-4 pt-4 border-t border-primary/10 relative z-50">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 font-semibold h-11 rounded-xl group/btn relative z-50"
            style={{ pointerEvents: 'auto' }}
          >
            <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Clickable overlay for product details - only on image area, not blocking bottom section */}
      <Link 
        href={`/products/${product.id}`} 
        className="absolute top-0 left-0 right-0 h-[calc(100%-200px)] z-[5]" 
        aria-label={`View details for ${product.name}`}
        prefetch={true}
      />
    </motion.div>
  );
}
