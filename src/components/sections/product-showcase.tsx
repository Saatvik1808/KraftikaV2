
"use client";

import * as React from "react"; 
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const localProductImage = "/images/products/kraftika-bowl-candle.jpg";

// Sample Product Data (Replace with actual data fetching)
const sampleProducts: Candle[] = [
  { id: '1', name: 'Sunrise Citrus', scentCategory: 'Citrus', price: 28, imageUrl: localProductImage, description: 'Zesty lemon and sweet orange.', scentNotes: 'Lemon, Orange, Bergamot', burnTime: '40 hours', ingredients: 'Soy Wax, Essential Oils' },
  { id: '2', name: 'Lavender Dreams', scentCategory: 'Floral', price: 32, imageUrl: localProductImage, description: 'Calming lavender fields.', scentNotes: 'Lavender, Chamomile, Vanilla', burnTime: '45 hours', ingredients: 'Soy Wax, Natural Fragrance' },
  { id: '3', name: 'Vanilla Bean Bliss', scentCategory: 'Sweet', price: 30, imageUrl: localProductImage, description: 'Warm and comforting vanilla.', scentNotes: 'Vanilla Bean, Sugar, Buttercream', burnTime: '50 hours', ingredients: 'Coconut Wax Blend, Fragrance Oil' },
  { id: '4', name: 'Mint Mojito', scentCategory: 'Fresh', price: 29, imageUrl: localProductImage, description: 'Cool mint and zesty lime.', scentNotes: 'Mint, Lime, Sugar', burnTime: '40 hours', ingredients: 'Soy Wax, Essential Oils' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 } // Slightly faster stagger
  }
};

export function ProductShowcase() {
  // In a real app, fetch featured products here
  const featuredProducts = sampleProducts.slice(0, 4); // Show first 4

  // Placeholder state for sorting/filtering - implement logic if needed
  const [sortBy, setSortBy] = React.useState<string>("popularity");

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-peach relative"> {/* Peach Gradient */}
       {/* Optional: Add curved divider */}
       {/* <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent section-divider" style={{ clipPath: 'ellipse(100% 50% at 50% 100%)' }}></div> */}

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center md:mb-12">
          <motion.h2
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.5 }}
             className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Discover Your Favourite Scents
          </motion.h2>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.3 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="mt-3 text-lg text-muted-foreground/90 md:mt-4"
           >
            Hand-poured with love, designed to delight.
          </motion.p>
        </div>

         {/* Filter/Sort Controls Placeholder */}
        <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.2 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4"
         >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {/* Placeholder for actual filter buttons/dropdown */}
                <Button variant="outline" size="sm" className="border-primary/30 text-primary-foreground/90 hover:bg-primary/10 hover:text-primary-foreground">
                    <ListFilter className="mr-2 h-4 w-4" /> Filter Scents
                </Button>
            </div>
             <div className="w-full sm:w-auto">
                 <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[180px] text-sm h-9 border-primary/30 focus:ring-primary/50">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="popularity">Popularity</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                 </Select>
            </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }} // Trigger animation earlier
        >
          {featuredProducts.map((product) => (
             <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.2 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             className="mt-12 text-center"
         >
          <Button asChild variant="outline" size="lg" className="group border-primary/50 text-primary-foreground hover:bg-primary/10 hover:text-primary-foreground hover:border-primary/70 transition-all duration-300">
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
