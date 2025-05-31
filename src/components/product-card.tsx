
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Candle } from "@/types/candle";
import { ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Candle;
}

const cardVariants = {
  rest: {
      scale: 1,
      rotateY: 0,
      boxShadow: "var(--glass-shadow)", // Use glass shadow variable
      transition: { duration: 0.3, ease: "easeOut" }
    },
  hover: {
    scale: 1.02, // Slightly less scale on hover
    rotateY: 2, // Slightly less tilt
    // Dynamic shadow based on primary color HSL variable
    boxShadow: `0 8px 20px -4px hsla(var(--primary-hsl), 0.25), 0 4px 8px -5px hsla(var(--primary-hsl), 0.2)`, // Refined shadow
    transition: { type: "spring", stiffness: 400, damping: 20 }, // Adjusted spring physics
  },
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] } }, // Slightly less image zoom
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      // Apply glassmorphism, ensure full height for grid layout
      className="group relative flex flex-col overflow-hidden rounded-lg border border-[hsl(var(--border)/0.15)] glassmorphism h-full shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${product.name}`}>
        <span className="sr-only">View details for ${product.name}</span>
      </Link>
      {/* Adjusted aspect ratio for mobile (square) and kept original for sm+ */}
      <div className="relative overflow-hidden aspect-square sm:aspect-[4/4.5] rounded-t-lg">
          <motion.div variants={imageVariants} className="h-full w-full">
             <Image
               src={product.imageUrl}
               alt={product.name}
               fill
               sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
               className="object-cover transition-transform duration-500 ease-in-out"
               data-ai-hint={`${product.scentCategory.toLowerCase()} candle`}
             />
           </motion.div>
        {/* Badge slightly smaller and positioned */}
        <Badge variant="secondary" className="absolute top-2 right-2 z-20 bg-secondary/80 text-secondary-foreground backdrop-blur-sm shadow-sm text-[10px] px-2 py-0.5">
          {product.scentCategory}
        </Badge>
      </div>

      {/* Reduced padding in the content area for mobile, original for sm+ */}
      <div className="flex flex-1 flex-col p-2 sm:p-3 justify-between">
        <div>
            {/* Adjusted font size for mobile */}
            <h3 className="text-sm sm:text-base font-semibold leading-tight text-foreground mb-0.5 group-hover:text-primary transition-colors">
                <Link href={`/products/${product.id}`} className="focus:outline-none relative z-20 before:absolute before:inset-0">
                    {product.name}
                 </Link>
            </h3>
            {/* Adjusted font size and margin for mobile */}
            <p className="text-base sm:text-lg font-bold text-primary mb-1 sm:mb-2">
              ₹{product.price.toFixed(2)}
            </p>
        </div>

        {/* Adjusted top margin for mobile */}
        <div className="mt-1 sm:mt-1.5 flex justify-between items-center space-x-2 relative z-20 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          <Button
             size="sm"
             variant="default"
             className="flex-1 btn-primary h-8 text-xs group-hover:scale-[1.03] transform transition-transform duration-200"
             aria-label={`Add ${product.name} to cart`}
             onClick={(e) => { e.stopPropagation(); console.log(`Add ${product.id} to cart`); }} // Prevent link navigation
           >
            <ShoppingCart className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
           <Button
             size="icon"
             variant="outline"
             className="h-8 w-8 border-border/30 hover:bg-primary/10 hover:border-primary/40 group-hover:scale-[1.03] transform transition-transform duration-200 shrink-0"
              aria-label={`Quick view ${product.name}`}
              onClick={(e) => { e.stopPropagation(); console.log(`Quick view ${product.id}`); }}
              asChild
           >
              <Link href={`/products/${product.id}`}>
                 <Eye className="h-3.5 w-3.5 text-foreground/60 group-hover:text-primary" />
             </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
    