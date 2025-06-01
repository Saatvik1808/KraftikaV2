
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Candle } from "@/types/candle";
import { ShoppingCart, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // Import useRouter

interface ProductCardProps {
  product: Candle;
  priority?: boolean;
}

interface CartStorageItem {
  id: string;
  quantity: number;
}

const cardVariants = {
  rest: {
      scale: 1,
      rotateY: 0,
      boxShadow: "var(--glass-shadow)",
      transition: { duration: 0.3, ease: "easeOut" }
    },
  hover: {
    scale: 1.02,
    rotateY: 2,
    boxShadow: `0 5px 22px 0px hsla(var(--primary-hsl), 0.35), 0 2px 10px -3px hsla(var(--primary-hsl), 0.3)`,
    transition: { type: "spring", stiffness: 350, damping: 20 },
  },
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] } },
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter

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
        onClick: () => router.push('/cart'), // Add onClick handler
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
      className="group relative flex flex-col overflow-hidden rounded-lg border border-[hsl(var(--border)/0.15)] glassmorphism h-full shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${product.name}`}>
        <span className="sr-only">View details for ${product.name}</span>
      </Link>
      <div className="relative overflow-hidden aspect-square sm:aspect-[4/4.5] rounded-t-lg">
          <motion.div variants={imageVariants} className="h-full w-full">
             <Image
               src={product.imageUrl}
               alt={product.name}
               fill
               sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
               className="object-cover transition-transform duration-500 ease-in-out"
               data-ai-hint="handcrafted candle"
               priority={priority}
             />
           </motion.div>
        <Badge variant="secondary" className="absolute top-2 right-2 z-20 bg-secondary/80 text-secondary-foreground backdrop-blur-sm shadow-sm text-[10px] px-2 py-0.5">
          {product.scentCategory}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-2 sm:p-3 justify-between">
        <div>
            <h3 className="text-sm sm:text-base font-semibold leading-tight text-foreground mb-0.5 group-hover:text-primary transition-colors">
                <Link href={`/products/${product.id}`} className="focus:outline-none relative z-20 before:absolute before:inset-0">
                    {product.name}
                 </Link>
            </h3>
            <p className="text-base sm:text-lg font-bold text-primary mb-1 sm:mb-2">
              ₹{product.price.toFixed(2)}
            </p>
        </div>

        <div className="mt-1 sm:mt-1.5 flex justify-between items-center space-x-2 relative z-20 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          <Button
             size="sm"
             variant="default"
             className="flex-1 btn-primary h-8 text-xs group-hover:scale-[1.03] transform transition-transform duration-200"
             aria-label={`Add ${product.name} to cart`}
             onClick={handleAddToCart}
           >
            <ShoppingCart className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
           <Button
             size="icon"
             variant="outline"
             className="h-8 w-8 border-border/30 hover:bg-primary/10 hover:border-primary/40 group-hover:scale-[1.03] transform transition-transform duration-200 shrink-0"
             aria-label={`View ${product.name} details`}
             asChild
           >
              <Link href={`/products/${product.id}`}>
                 <Eye className="h-4 w-4 text-foreground/70 group-hover:text-primary" />
             </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
