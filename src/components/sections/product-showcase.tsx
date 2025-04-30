"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card"; // Assuming ProductCard exists
import type { Candle } from "@/types/candle"; // Assuming Candle type exists

// Sample Product Data (Replace with actual data fetching)
const sampleProducts: Candle[] = [
  { id: '1', name: 'Sunrise Citrus', scentCategory: 'Citrus', price: 28, imageUrl: 'https://picsum.photos/seed/candle1/400/500', description: '...', scentNotes: '...', burnTime: '...', ingredients: '...' },
  { id: '2', name: 'Lavender Dreams', scentCategory: 'Floral', price: 32, imageUrl: 'https://picsum.photos/seed/candle2/400/500', description: '...', scentNotes: '...', burnTime: '...', ingredients: '...' },
  { id: '3', name: 'Vanilla Bean Bliss', scentCategory: 'Sweet', price: 30, imageUrl: 'https://picsum.photos/seed/candle3/400/500', description: '...', scentNotes: '...', burnTime: '...', ingredients: '...' },
    { id: '4', name: 'Mint Mojito', scentCategory: 'Fresh', price: 29, imageUrl: 'https://picsum.photos/seed/candle4/400/500', description: '...', scentNotes: '...', burnTime: '...', ingredients: '...' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function ProductShowcase() {
  // In a real app, fetch featured products here
  const featuredProducts = sampleProducts.slice(0, 4); // Show first 4

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background via-transparent to-background">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Featured Scents
          </h2>
          <p className="mt-3 text-lg text-muted-foreground md:mt-4">
            Explore our most loved handcrafted candles.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuredProducts.map((product) => (
             <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
