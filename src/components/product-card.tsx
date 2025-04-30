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
      transition: { duration: 0.3 }
    },
  hover: {
    scale: 1.03,
    rotateY: 3, // Subtle tilt
    // Dynamic shadow based on primary color HSL variable
    boxShadow: `0 10px 25px -5px hsla(var(--primary-hsl), 0.3), 0 5px 10px -6px hsla(var(--primary-hsl), 0.2)`,
    transition: { type: "spring", stiffness: 350, damping: 18 },
  },
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] } },
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group relative flex flex-col overflow-hidden rounded-lg border border-[hsl(var(--border)/0.2)] glassmorphism h-full" // Apply glassmorphism
    >
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${product.name}`}>
        <span className="sr-only">View details for {product.name}</span>
      </Link>
      <div className="relative overflow-hidden aspect-[4/5] rounded-t-lg"> {/* Ensure image corners match card */}
          <motion.div variants={imageVariants}>
             <Image
               src={product.imageUrl}
               alt={product.name}
               fill
               sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
               className="object-cover transition-transform duration-500 ease-in-out" // Removed group-hover:scale for Framer motion control
             />
           </motion.div>
        <Badge variant="secondary" className="absolute top-3 right-3 z-20 bg-secondary/80 text-secondary-foreground backdrop-blur-sm shadow-sm">
          {product.scentCategory}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
            <h3 className="text-lg font-semibold leading-tight text-foreground mb-1 group-hover:text-primary transition-colors">
                {/* Ensure link doesn't prevent hover on card */}
                <Link href={`/products/${product.id}`} className="focus:outline-none relative z-20 before:absolute before:inset-0">
                    {product.name}
                 </Link>
            </h3>
            <p className="text-xl font-bold text-primary mb-3">
              ${product.price.toFixed(2)}
            </p>
        </div>

        {/* Buttons - made slightly more visible initially, enhanced on hover */}
        <div className="mt-2 flex justify-between items-center space-x-2 relative z-20 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          <Button
             size="sm"
             variant="default"
             className="flex-1 btn-primary group-hover:scale-105 transform transition-transform duration-200" // Use primary button style
             aria-label={`Add ${product.name} to cart`}
             onClick={(e) => { e.stopPropagation(); console.log(`Add ${product.id} to cart`); }} // Prevent link navigation
           >
            <ShoppingCart className="mr-1.5 h-4 w-4" /> Add
          </Button>
           <Button
             size="icon" // Changed to icon size for compactness
             variant="outline"
             className="border-border/40 hover:bg-primary/10 hover:border-primary/30 group-hover:scale-105 transform transition-transform duration-200"
              aria-label={`Quick view ${product.name}`}
              onClick={(e) => { e.stopPropagation(); console.log(`Quick view ${product.id}`); }}
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
