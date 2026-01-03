"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Candle } from "@/types/candle";
import { ShoppingCart, Eye, Star, X, Leaf, Award, Image as ImageIcon, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { addItemToCart } from "@/services/cart-sync";
import { trackAddToCart, trackWishlistRemove } from "@/lib/analytics";

interface WishlistCardProps {
  product: Candle;
  onRemove: (productId: string) => void;
  priority?: boolean;
}

export function WishlistCard({ product, onRemove, priority = false }: WishlistCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAddingToCart(true);

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
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    
    trackWishlistRemove({
      id: product.id,
      name: product.name,
    });
    
    onRemove(product.id);
    
    toast({
      title: "Removed from Wishlist",
      description: `${product.name} has been removed from your wishlist.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "bg-white dark:bg-gray-900",
        "border border-gray-200 dark:border-gray-800",
        "shadow-md hover:shadow-xl hover:shadow-primary/10",
        "transition-all duration-300"
      )}
    >
      <Link 
        href={`/products/${product.id}`} 
        className="absolute top-0 left-0 right-0 h-[calc(100%-240px)] z-[5]" 
        aria-label={`View details for ${product.name}`}
        prefetch={true}
      />

      {/* Image container */}
      <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={`${product.name} - ${product.scentCategory} scented candle`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-30">
          <Badge className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white backdrop-blur-md shadow-lg px-2.5 py-1 text-xs font-semibold border border-gray-300/80 dark:border-gray-600/80">
            {product.scentCategory}
          </Badge>
        </div>

        {/* Remove from wishlist button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="absolute top-3 right-3 z-30 h-9 w-9 rounded-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-lg hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 dark:hover:border-red-800 border border-gray-200 dark:border-gray-800 transition-all duration-200"
          aria-label="Remove from wishlist"
        >
          <X className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400" />
        </Button>

        {/* New badge */}
        {product.isNew && (
          <div className="absolute top-3 right-14 z-30">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white backdrop-blur-md shadow-md px-2.5 py-1 text-xs font-semibold border-0 ring-2 ring-white/50 dark:ring-gray-950/50">
              <Sparkles className="h-3 w-3 mr-1" />
              New
            </Badge>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-5 space-y-3 bg-white dark:bg-gray-900">
        {/* Product name */}
        <div>
          <h3 className="text-lg font-semibold leading-tight text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating with review count */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5 transition-colors",
                      i < (product?.rating || 4)
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-gray-300 dark:text-gray-600'
                    )}
                  />
                ))}
              </div>
              {product.reviewCount && product.reviewCount > 0 && (
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">incl. taxes</span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
            <Leaf className="h-3 w-3 text-green-600 dark:text-green-400" />
            <span>Eco-Friendly</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
            <Award className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            <span>Handcrafted</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-2">
          <Button
            size="default"
            className="flex-1 h-10 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200"
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

