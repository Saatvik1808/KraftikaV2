"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ListFilter, X, Info } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getProducts } from "@/services/products";

const scentCategories = ["All", "Citrus", "Floral", "Sweet", "Fresh", "Fruity"];
const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.06,
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
  const [selectedScent, setSelectedScent] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<string>("popularity");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

  // Fetch products from Firestore
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  React.useEffect(() => {
    let products = [...allProducts];

    // Filter
    if (selectedScent !== "All") {
      products = products.filter(p => p.scentCategory === selectedScent);
    }

    // Sort
    switch (sortBy) {
      case "price-asc": products.sort((a, b) => a.price - b.price); break;
      case "price-desc": products.sort((a, b) => b.price - a.price); break;
      case "newest": products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "popularity": default: products.sort((a, b) => b.popularity - a.popularity); break;
    }

    setFilteredProducts(products);
  }, [selectedScent, sortBy, allProducts]);

  const FilterControls = () => (
    <>
      <div className="space-y-4">
        <Label className="text-base font-medium text-gray-900 dark:text-gray-100">Filter by Scent</Label>
        <RadioGroup 
          value={selectedScent} 
          onValueChange={setSelectedScent}
          className="grid grid-cols-2 gap-3"
        >
          {scentCategories.map((category) => (
            <div key={category} className="flex items-center space-x-3">
              <RadioGroupItem 
                value={category} 
                id={`scent-${category.toLowerCase()}`} 
                className="h-4 w-4 border-gray-400 dark:border-gray-500 text-primary data-[state=checked]:border-primary" 
              />
              <Label 
                htmlFor={`scent-${category.toLowerCase()}`} 
                className="text-sm font-normal text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer transition-colors"
              >
                {category}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <Separator className="my-6 bg-gray-200 dark:bg-gray-800" />
      
      <div className="space-y-3">
        <Label htmlFor="sort-by" className="text-base font-medium text-gray-900 dark:text-gray-100">Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger
            id="sort-by"
            className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            {sortOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 md:px-6 lg:py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1   className="mb-10 text-center text-4xl font-bold tracking-tight sm:text-5xl
             text-transparent bg-clip-text bg-gradient-to-r
             from-primary via-secondary to-accent
             filter brightness-75">
          Our Candle Collection
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Handcrafted scents to illuminate your space and soothe your soul
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isLoading ? "Loading..." : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}`}
        </span>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ListFilter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-6 bg-white dark:bg-gray-900">
              <SheetHeader className="mb-6 flex flex-row justify-between items-center">
                <SheetTitle className="text-xl font-semibold text-gray-900 dark:text-white">Filters</SheetTitle>
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
            </SheetContent>
          </Sheet>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              {sortOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block lg:col-span-1 space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm h-fit sticky top-24"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          <FilterControls />
        </motion.aside>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:col-span-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="col-span-full flex flex-col items-center justify-center text-center py-16 space-y-4"
              >
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Loading products...</h3>
                <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your favorite scents</p>
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
                    priority={index < 6} // Prioritize first 6 images
                    className="h-full transition-transform hover:scale-[1.02] hover:shadow-md"
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="col-span-full flex flex-col items-center justify-center text-center py-16 space-y-4"
              >
                <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                  <Info className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Try adjusting your filters or browse our full collection
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedScent("All");
                    setSortBy("popularity");
                  }}
                  className="mt-4"
                >
                  Reset filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}