
"use client";

import * as React from "react"; 
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import allProductsData from "@/data/products.json"; // Import the centralized product data

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 } 
  }
};

export function ProductShowcase() {
  // Use the centralized product data
  const allProducts: Candle[] = allProductsData;
  const featuredProducts = allProducts.slice(0, 4); // Show first 4

  const [sortBy, setSortBy] = React.useState<string>("popularity");

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-peach relative"> 
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

        <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, amount: 0.2 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4"
         >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
          viewport={{ once: true, amount: 0.1 }} 
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
