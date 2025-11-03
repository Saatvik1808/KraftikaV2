
"use client";

import * as React from "react"; 
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShowcaseProductCard } from "@/components/showcase-product-card";
import type { Candle } from "@/types/candle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProducts, getProductCategories } from "@/services/products-unified";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.06, 
      delayChildren: 0.1,
      type: "spring",
      stiffness: 100,
      damping: 15
    } 
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.5
    }
  }
};

export function ProductShowcase() {
  const [allProducts, setAllProducts] = React.useState<Candle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [categories, setCategories] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<string>("popularity");

  // Show 8 products for showcase
  const displayCount = 8;

  // Fetch products and categories
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [products, productCategories] = await Promise.all([
          getProducts(),
          getProductCategories()
        ]);
        setAllProducts(products);
        setCategories(["all", ...productCategories]);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error to show empty state
        setAllProducts([]);
        setCategories(["all"]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products
  const filteredProducts = React.useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.scentCategory?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        case "popularity":
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

    return sorted;
  }, [allProducts, selectedCategory, sortBy]);

  // Get featured products for display
  const featuredProducts = filteredProducts.slice(0, displayCount);

  return (
    <section className="w-full py-20 md:py-32 relative overflow-hidden"> 
      {/* Beautiful background gradient with subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-primary/10 to-muted/15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(145,210,144,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,183,77,0.1),transparent_50%)]" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <Sparkles className="absolute top-32 right-1/4 h-20 w-20 text-primary/10 opacity-60 animate-pulse -z-0" />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        {/* Enhanced header section */}
        <div className="mb-12 text-center md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4"
          >
            <Sparkles className="h-8 w-8 text-primary mx-auto" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text"
          >
            Discover Your Favourite Scents
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed"
          >
            Hand-poured with love, designed to delight. Explore our curated collection of artisanal candles crafted to transform your space.
          </motion.p>
        </div>

        {/* Category filter tabs */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 md:mb-12"
          >
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "capitalize transition-all duration-300",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "border-primary/30 hover:bg-primary/10 hover:border-primary/50 hover:scale-105"
                  )}
                >
                  {category === "all" ? "All Scents" : category}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sort and filter controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="text-sm text-muted-foreground/80">
            Showing <span className="font-semibold text-foreground">{featuredProducts.length}</span> of{" "}
            <span className="font-semibold text-foreground">{filteredProducts.length}</span> candles
          </div>
          
          <div className="w-full sm:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px] text-sm h-10 border-primary/30 focus:ring-primary/50 bg-background/80 backdrop-blur-sm">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Enhanced product grid with staggered animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${sortBy}-${featuredProducts.length}`}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate={!isLoading ? "visible" : "hidden"}
            whileInView={!isLoading ? "visible" : undefined}
            viewport={{ once: false, amount: 0.1 }}
            exit="hidden"
          >
            {isLoading ? (
              // Enhanced loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="animate-pulse"
                >
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl h-80 mb-4 shadow-sm" />
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-5 mb-3" />
                  <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-4 w-2/3" />
                </motion.div>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => {
                // Validate product before rendering
                if (!product || !product.id) {
                  return null;
                }
                
                return (
                  <motion.div
                    key={product.id || `product-${index}`}
                    variants={itemVariants}
                    custom={index}
                    layout
                    style={{ opacity: 1, visibility: 'visible' }}
                  >
                    <ShowcaseProductCard 
                      product={product} 
                      priority={index < 4}
                    />
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                variants={itemVariants}
                className="col-span-full text-center py-16"
              >
                <div className="inline-block p-6 bg-muted/50 rounded-full mb-4">
                  <Filter className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <p className="text-lg text-muted-foreground">
                  {allProducts.length === 0 
                    ? "No products available at the moment. Please check back later!"
                    : `No candles found in this category. Try selecting a different scent!`}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Enhanced CTA button */}
        {filteredProducts.length > displayCount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg font-semibold rounded-full"
            >
              <Link href="/products">
                <span className="relative z-10 flex items-center">
                  Explore All {filteredProducts.length} Candles
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
