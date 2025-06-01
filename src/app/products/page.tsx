
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
import allProductsData from "@/data/products.json"; // Import the centralized product data

const allProducts: Candle[] = allProductsData;

const scentCategories = ["All", "Citrus", "Floral", "Sweet", "Fresh", "Fruity"]; // Consider deriving from allProducts
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
      transition: { staggerChildren: 0.06 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 12 } }
};


export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = React.useState<Candle[]>(allProducts);
  const [selectedScent, setSelectedScent] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<string>("popularity");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);

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
      case "newest": products.sort((a, b) => parseInt(b.id) - parseInt(a.id)); break; 
      case "popularity": default: products.sort((a, b) => parseInt(a.id) - parseInt(b.id)); break; 
    }

    setFilteredProducts(products);
  }, [selectedScent, sortBy]);

  const FilterControls = () => (
    <>
        <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground/90">Filter by Scent</Label>
            <RadioGroup value={selectedScent} onValueChange={setSelectedScent} className="space-y-2.5">
                {scentCategories.map((category) => (
                <div key={category} className="flex items-center space-x-3">
                    <RadioGroupItem value={category} id={`scent-${category.toLowerCase()}`} className="border-primary/40 data-[state=checked]:border-primary" />
                    <Label htmlFor={`scent-${category.toLowerCase()}`} className="font-normal text-foreground/80 hover:text-foreground cursor-pointer transition-colors">{category}</Label>
                </div>
                ))}
            </RadioGroup>
        </div>
        <Separator className="my-6 bg-border/30" />
        <div className="space-y-2">
            <Label htmlFor="sort-by" className="text-lg font-semibold text-foreground/90">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
                id="sort-by"
                className="w-full border-border/50 bg-background/60 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary/70 transition-colors duration-200"
            >
                <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
                {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                    {option.label}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
    </>
  )

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
       <motion.h1
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="mb-10 text-center text-4xl font-bold tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent filter brightness-80"
       >
        Our Candle Collection
      </motion.h1>

        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 flex justify-between items-center"
         >
            <span className="text-sm text-muted-foreground/90">Showing {filteredProducts.length} products</span>
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="sm" className="border-primary/40 text-primary/90 hover:bg-primary/10">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filters & Sort
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] glassmorphism p-6 border-r border-[hsl(var(--border)/0.2)]">
                 <SheetHeader className="mb-6 flex flex-row justify-between items-center text-left">
                    <SheetTitle className="text-xl font-semibold">Filters & Sort</SheetTitle>
                     <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)} aria-label="Close Filters">
                        <X className="h-5 w-5 text-foreground/70 hover:text-primary"/>
                     </Button>
                 </SheetHeader>
                 <FilterControls />
              </SheetContent>
            </Sheet>
        </motion.div>


      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
         <motion.aside
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="hidden md:block md:col-span-1 space-y-6 p-6 glassmorphism h-fit sticky top-24 border border-[hsl(var(--border)/0.2)]"
         >
            <FilterControls/>
        </motion.aside>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:col-span-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
             {filteredProducts.length > 0 ? (
             filteredProducts.map((product, index) => ( // Added index
                 <motion.div key={product.id} variants={itemVariants} layout>
                     <ProductCard product={product} priority={index < 4} /> {/* Prioritize first 4 images */}
                 </motion.div>
             ))
             ) : (
                 <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.3 }}
                     className="col-span-full flex flex-col items-center justify-center text-center py-16 space-y-3"
                 >
                    <Info className="h-12 w-12 text-muted-foreground/60" />
                    <p className="text-lg text-foreground/80">No candles match your filters.</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your search or explore all our scents!</p>
                 </motion.div>
             )}
         </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
}
