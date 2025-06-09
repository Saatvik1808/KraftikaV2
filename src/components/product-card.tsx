"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Candle } from "@/types/candle";
import { ShoppingCart, Eye, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Candle;
  priority?: boolean;
  className?: string;
  showRating?: boolean;
}

interface CartStorageItem {
  id: string;
  quantity: number;
}

const cardVariants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: { duration: 0.3, ease: "easeOut" }
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15,
      duration: 0.5
    },
  },
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05, 
    transition: { 
      duration: 0.6, 
      ease: [0.33, 1, 0.68, 1] 
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

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      const cartString = localStorage.getItem('kraftikaCart');
      let currentCart: CartStorageItem[] = cartString ? JSON.parse(cartString) : [];
      
      const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity += 1;
      } else {
        currentCart.push({ id: product.id, quantity: 1 });
      }
      
      localStorage.setItem('kraftikaCart', JSON.stringify(currentCart));
      
      toast({
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart.`,
        onClick: () => router.push('/cart'),
      });

    } catch (error) {
      console.error("Failed to update cart in localStorage", error);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900",
        "border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md",
        "transition-all duration-300 ease-out",
        className
      )}
    >
      {/* Quick view overlay */}
      <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
      </div>

      <Link 
        href={`/products/${product.id}`} 
        className="absolute inset-0 z-20" 
        aria-label={`View details for ${product.name}`}
      />

      {/* Image container */}
      <div className="relative overflow-hidden aspect-square sm:aspect-[4/4.5]">
        <motion.div 
          variants={imageVariants} 
          className="h-full w-full"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
            className="object-cover transition-transform duration-500 ease-out"
            priority={priority}
          />
        </motion.div>

        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-2">
          <Badge 
            variant="secondary" 
            className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 backdrop-blur-sm shadow-sm px-2.5 py-0.5 text-xs font-medium"
          >
            {product.scentCategory}
          </Badge>
          
          {product.isNew && (
            <Badge className="bg-green-500/90 text-white backdrop-blur-sm shadow-sm px-2.5 py-0.5 text-xs font-medium">
              New Arrival
            </Badge>
          )}
        </div>
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3">
          <h3 className="text-sm sm:text-base font-semibold leading-tight text-gray-900 dark:text-gray-100 mb-1.5 line-clamp-2">
            {product.name}
          </h3>
          
          {showRating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3.5 w-3.5 ${i < (product?.rating || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                ({product.reviewCount || 24})
              </span>
            </div>
          )}
          
          <p className="text-lg font-bold text-primary dark:text-primary-400">
            ₹{product.price.toFixed(2)}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-auto flex justify-between items-center gap-2 relative z-20">
          <Button
            size="sm"
            variant="default"
            className="flex-1 h-9 text-sm font-medium group-hover:bg-primary/95 transition-colors"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          
          <Button
            size="icon"
            variant="outline"
            className="h-9 w-9 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 group-hover:border-primary/30 transition-colors"
            asChild
          >
            <Link href={`/products/${product.id}`}>
              <Eye className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}