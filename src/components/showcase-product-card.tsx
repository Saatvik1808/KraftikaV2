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
import { trackProductClick, trackAddToCart } from "@/lib/analytics";

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

  const handleProductClick = () => {
    trackProductClick({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.scentCategory,
      listName: 'Product Showcase',
    });
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
          // Track add to cart event
          trackAddToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            category: product.scentCategory,
          });
          
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
          {(() => {
            // Use first image from imageUrls array, or fallback to imageUrl for backward compatibility
            const imageUrl = (product.imageUrls && product.imageUrls.length > 0) 
              ? product.imageUrls[0] 
              : (product.imageUrl || '');
            
            return imageUrl ? (
              <Image
                src={imageUrl}
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
            );
          })()}
        </motion.div>

        {/* Elegant overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category badge - top right with better contrast */}
        <div className="absolute top-4 right-4 z-40 pointer-events-none">
          <Badge 
            className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white backdrop-blur-md shadow-lg px-3 py-1.5 text-xs font-semibold border border-gray-300/80 dark:border-gray-600/80"
          >
            {product.scentCategory}
          </Badge>
        </div>

        {/* Price overlay - bottom of image with better readability */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-white dark:bg-gray-950 backdrop-blur-md rounded-xl p-3 shadow-2xl border border-gray-200/80 dark:border-gray-700/80">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{product.price.toFixed(0)}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {(product as any)?.rating || 4.5}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product info section - improved readability */}
      <div className="relative p-6 bg-white dark:bg-gray-900 z-50 border-t border-gray-100 dark:border-gray-800">
        <div className="space-y-3 relative z-50">
          {/* Product name */}
          <Link 
            href={`/products/${product.id}`} 
            className="block relative z-50"
            onClick={handleProductClick}
          >
            <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
              {product.name}
            </h3>
          </Link>

          {/* Price - always visible for better UX */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">incl. taxes</span>
          </div>

          {/* Rating - compact */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-4 w-4 transition-all",
                    i < ((product as any)?.rating || 4) 
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
        </div>

        {/* Action button - elegant and prominent */}
        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 relative z-50">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 font-semibold h-11 rounded-xl group/btn relative z-50"
            style={{ pointerEvents: 'auto' }}
          >
            <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
            Order Online
          </Button>
        </div>
      </div>

      {/* Clickable overlay for product details - only on image area, not blocking bottom section */}
      <Link 
        href={`/products/${product.id}`} 
        className="absolute top-0 left-0 right-0 h-[calc(100%-220px)] z-[5]" 
        aria-label={`View details for ${product.name}`}
        prefetch={true}
        onClick={handleProductClick}
      />
    </motion.div>
  );
}
