"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListFilter, X, Info, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getProducts } from "@/services/products-unified";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { trackCategoryFilter, trackPriceRangeFilter, trackSortSelection } from "@/lib/analytics";

const scentCategories = ["All", "Citrus", "Floral", "Sweet", "Fresh", "Fruity"];
const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹1500", min: 1000, max: 1500 },
  { label: "Above ₹1500", min: 1500, max: Infinity },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 12,
      mass: 0.5
    } 
  }
};

export default function ProductsPage() {
  const [allProducts, setAllProducts] = React.useState<Candle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [filteredProducts, setFilteredProducts] = React.useState<Candle[]>([]);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const [selectedScent, setSelectedScent] = React.useState<string>("All");
  const [selectedPriceRange, setSelectedPriceRange] = React.useState<string>("All Prices");
  const [sortBy, setSortBy] = React.useState<string>("popularity");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  // Fetch products
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setHasLoaded(false);
        const products = await getProducts();
        setAllProducts(products);
        // Initialize filtered products with all products
        setFilteredProducts(products);
        setHasLoaded(true);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
        setFilteredProducts([]);
        setHasLoaded(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  React.useEffect(() => {
    // Don't filter if still loading or hasn't loaded yet
    if (isLoading || !hasLoaded) {
      return;
    }

    // If no products, ensure filteredProducts is empty
    if (allProducts.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let products = [...allProducts];

    // Filter by scent category
    if (selectedScent !== "All") {
      products = products.filter(p => p.scentCategory === selectedScent);
    }

    // Filter by price range
    if (selectedPriceRange !== "All Prices") {
      const range = priceRanges.find(r => r.label === selectedPriceRange);
      if (range) {
        products = products.filter(p => p.price >= range.min && p.price <= range.max);
      }
    }

    // Sort
    switch (sortBy) {
      case "price-asc": 
        products.sort((a, b) => a.price - b.price); 
        break;
      case "price-desc": 
        products.sort((a, b) => b.price - a.price); 
        break;
      case "newest": 
        products.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()); 
        break;
      case "popularity": 
      default: 
        products.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)); 
        break;
    }

    setFilteredProducts(products);
  }, [selectedScent, selectedPriceRange, sortBy, allProducts, isLoading, hasLoaded]);

  const FilterControls = () => (
    <>
      <div className="space-y-4">
        <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wider uppercase">
          Scent Category
        </Label>
        <div className="flex flex-wrap gap-2.5">
          {scentCategories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedScent(category);
                if (category !== "All") {
                  trackCategoryFilter(category);
                }
              }}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                "border hover:scale-105 active:scale-95",
                selectedScent === category
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <Separator className="my-6 bg-gray-200/50 dark:bg-gray-800/50" />
      
      <div className="space-y-4">
        <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wider uppercase">
          Price Range
        </Label>
        <div className="flex flex-col gap-2">
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => {
                setSelectedPriceRange(range.label);
                if (range.label !== "All Prices") {
                  trackPriceRangeFilter(range.label);
                }
              }}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left",
                "border hover:scale-[1.01] active:scale-95",
                selectedPriceRange === range.label
                  ? "bg-primary text-primary-foreground border-primary shadow-sm font-semibold"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/80"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const activeFiltersCount = (selectedScent !== "All" ? 1 : 0) + (selectedPriceRange !== "All Prices" ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero Section - Elegant & Minimal */}
      <section className="relative overflow-hidden bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-100/50 dark:border-gray-800/50">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-gray-900 dark:text-white leading-tight mb-3">
              Home Made Scented Candles by Kraftika
            </h1>
            
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 font-light">
              Premium handcrafted scented candles - natural soy wax, hand-poured in India. <span className="font-semibold text-gray-900 dark:text-white">Order online now - delivered across India!</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12">
        {/* Filters & Sort Bar - Sticky on Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="sticky top-16 md:relative md:top-0 z-40 mb-8 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none py-4 md:py-0 -mx-4 md:mx-0 px-4 md:px-0 border-b md:border-b-0 border-gray-200/50 dark:border-gray-800/50"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader size="sm" />
                  Loading...
                </span>
              ) : (
                <>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {filteredProducts.length}
                  </span>{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}
                    </Badge>
                  )}
                </>
              )}
            </span>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <ListFilter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md overflow-y-auto">
                <SheetHeader className="mb-6 flex flex-row justify-between items-center">
                  <SheetTitle className="text-lg font-semibold text-gray-900 dark:text-white">Filters</SheetTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMobileFiltersOpen(false)} 
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </SheetHeader>
                <FilterControls />
                <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
                  <Button
                    variant="outline"
                    className="w-full border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => {
                      setSelectedScent("All");
                      setSelectedPriceRange("All Prices");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <Select value={sortBy} onValueChange={(value) => {
              setSortBy(value);
              trackSortSelection(value);
            }}>
              <SelectTrigger className="w-full sm:w-[200px] border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-primary/50 dark:hover:border-primary/50 focus:border-primary">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                {sortOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Desktop Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="hidden lg:block lg:col-span-1"
          >
            <div className="sticky top-28 space-y-6 p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-200/30 dark:border-gray-800/30 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => {
                      setSelectedScent("All");
                      setSelectedPriceRange("All Prices");
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <FilterControls />
            </div>
          </motion.aside>

          {/* Product Grid - 3 columns on desktop with generous spacing */}
          <motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:col-span-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {isLoading || !hasLoaded || (hasLoaded && allProducts.length === 0) ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-full flex flex-col items-center justify-center text-center py-20 space-y-4"
                >
                  <Loader size="lg" text="Loading products..." />
                </motion.div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <motion.div 
                    key={product.id} 
                    variants={itemVariants} 
                    layout
                    className="h-full"
                  >
                    <ProductCard 
                      product={product} 
                      priority={index < 6}
                      className="h-full"
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-full flex flex-col items-center justify-center text-center py-20 space-y-6"
                >
                  <div className="p-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20">
                    <Info className="h-12 w-12 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">No products found</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                      Try adjusting your filters to discover more products in our collection
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedScent("All");
                      setSelectedPriceRange("All Prices");
                    }}
                    className="mt-4"
                  >
                    Reset Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
