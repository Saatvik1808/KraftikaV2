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
  rest: { scale: 1, rotateY: 0, boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" },
  hover: {
    scale: 1.03,
    rotateY: 5, // Slight tilt
    boxShadow: "0 10px 30px hsla(var(--primary-hsl, 330 80% 70%), 0.3)", // Use theme color for glow
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08 },
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border/40 glassmorphism h-full transition-shadow duration-300"
    >
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${product.name}`}>
        <span className="sr-only">View details for {product.name}</span>
      </Link>
      <div className="relative overflow-hidden aspect-[4/5]"> {/* Aspect ratio for image */}
          <motion.div variants={imageVariants} transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}>
             <Image
               src={product.imageUrl}
               alt={product.name}
               fill
               sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
               className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" // Subtle zoom on hover
             />
           </motion.div>
        <Badge variant="secondary" className="absolute top-3 right-3 z-20 bg-secondary/80 text-secondary-foreground backdrop-blur-sm">
          {product.scentCategory}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
            <h3 className="text-lg font-semibold leading-tight text-foreground mb-1 group-hover:text-primary transition-colors">
                <Link href={`/products/${product.id}`} className="focus:outline-none relative z-20">
                    {product.name}
                 </Link>
            </h3>
            <p className="text-xl font-bold text-primary mb-3">
              ${product.price.toFixed(2)}
            </p>
        </div>

        {/* Buttons shown on hover - keep them accessible */}
        <div className="mt-auto flex justify-between items-center space-x-2 relative z-20">
          <Button
             size="sm"
             variant="default"
             className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary hover:bg-primary/90 text-primary-foreground"
             aria-label={`Add ${product.name} to cart`}
             onClick={(e) => { e.stopPropagation(); console.log(`Add ${product.id} to cart`); }} // Prevent link navigation
           >
            <ShoppingCart className="mr-1.5 h-4 w-4" /> Add
          </Button>
           <Button
             size="sm"
             variant="outline"
             className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label={`Quick view ${product.name}`}
              onClick={(e) => { e.stopPropagation(); console.log(`Quick view ${product.id}`); }} // Prevent link navigation
              asChild
           >
              <Link href={`/products/${product.id}`}>
                 <Eye className="h-4 w-4" />
             </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
