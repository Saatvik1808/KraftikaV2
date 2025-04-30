"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ListFilter, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Sample Product Data (Replace with actual data fetching and state management)
const allProducts: Candle[] = [
    { id: '1', name: 'Sunrise Citrus', scentCategory: 'Citrus', price: 28, imageUrl: 'https://picsum.photos/seed/candle1/400/500', description: 'Zesty lemon and sweet orange.', scentNotes: 'Lemon, Orange, Bergamot', burnTime: '40 hours', ingredients: 'Soy Wax, Essential Oils' },
    { id: '2', name: 'Lavender Dreams', scentCategory: 'Floral', price: 32, imageUrl: 'https://picsum.photos/seed/candle2/400/500', description: 'Calming lavender fields.', scentNotes: 'Lavender, Chamomile, Vanilla', burnTime: '45 hours', ingredients: 'Soy Wax, Natural Fragrance' },
    { id: '3', name: 'Vanilla Bean Bliss', scentCategory: 'Sweet', price: 30, imageUrl: 'https://picsum.photos/seed/candle3/400/500', description: 'Warm and comforting vanilla.', scentNotes: 'Vanilla Bean, Sugar, Buttercream', burnTime: '50 hours', ingredients: 'Coconut Wax Blend, Fragrance Oil' },
    { id: '4', name: 'Mint Mojito', scentCategory: 'Fresh', price: 29, imageUrl: 'https://picsum.photos/seed/candle4/400/500', description: 'Cool mint and zesty lime.', scentNotes: 'Mint, Lime, Sugar', burnTime: '40 hours', ingredients: 'Soy Wax, Essential Oils' },
    { id: '5', name: 'Rose Garden', scentCategory: 'Floral', price: 35, imageUrl: 'https://picsum.photos/seed/candle5/400/500', description: 'Delicate rose petals.', scentNotes: 'Rose, Geranium, Musk', burnTime: '45 hours', ingredients: 'Soy Wax, Natural Fragrance' },
    { id: '6', name: 'Spiced Apple', scentCategory: 'Fruity', price: 31, imageUrl: 'https://picsum.photos/seed/candle6/400/500', description: 'Warm apple and cinnamon.', scentNotes: 'Apple, Cinnamon, Clove', burnTime: '48 hours', ingredients: 'Soy Wax Blend, Fragrance Oil' },
    { id: '7', name: 'Ocean Breeze', scentCategory: 'Fresh', price: 33, imageUrl: 'https://picsum.photos/seed/candle7/400/500', description: 'Crisp sea salt air.', scentNotes: 'Sea Salt, Ozone, Jasmine', burnTime: '42 hours', ingredients: 'Soy Wax, Fragrance Oil' },
    { id: '8', name: 'Peach Paradise', scentCategory: 'Fruity', price: 27, imageUrl: 'https://picsum.photos/seed/candle8/400/500', description: 'Juicy peach nectar.', scentNotes: 'Peach, Mango, Coconut', burnTime: '38 hours', ingredients: 'Soy Wax, Fragrance Oil' },
];

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
      transition: { staggerChildren: 0.05 } // Faster stagger for grid
    }
};


export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = React.useState<Candle[]>(allProducts);
  const [selectedScent, setSelectedScent] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<string>("popularity");

  React.useEffect(() => {
    let products = [...allProducts];

    // Filter by scent
    if (selectedScent !== "All") {
      products = products.filter(p => p.scentCategory === selectedScent);
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
       case "newest":
         // Assuming higher ID means newer for sample data
         products.sort((a, b) => parseInt(b.id) - parseInt(a.id));
         break;
      // Add popularity logic if available, otherwise default sort (or keep as is)
      case "popularity":
      default:
        // Default sort (e.g., by ID or name if no popularity data)
        products.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
    }

    setFilteredProducts(products);
  }, [selectedScent, sortBy]);

  const FilterControls = () => (
    <>
        <div className="space-y-4">
            <Label className="text-lg font-semibold text-foreground">Filter by Scent</Label>
            <RadioGroup value={selectedScent} onValueChange={setSelectedScent} className="space-y-2">
                {scentCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                    <RadioGroupItem value={category} id={`scent-${category.toLowerCase()}`} />
                    <Label htmlFor={`scent-${category.toLowerCase()}`} className="font-normal text-foreground/80 cursor-pointer">{category}</Label>
                </div>
                ))}
            </RadioGroup>
        </div>
        <Separator className="my-6" />
        <div className="space-y-2">
            <Label htmlFor="sort-by" className="text-lg font-semibold text-foreground">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort-by" className="w-full">
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
      <h1 className="mb-8 text-center text-4xl font-bold tracking-tight text-primary sm:text-5xl">
        Our Candle Collection
      </h1>

        <div className="mb-6 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Showing {filteredProducts.length} products</span>
             {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="sm">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] glassmorphism p-6">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-semibold">Filters</h3>
                     <SheetTrigger asChild>
                         <Button variant="ghost" size="icon">
                             <X className="h-5 w-5"/>
                         </Button>
                     </SheetTrigger>
                 </div>
                 <FilterControls />
              </SheetContent>
            </Sheet>
        </div>


      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Desktop Filters */}
        <aside className="hidden md:block md:col-span-1 space-y-6 p-6 glassmorphism h-fit sticky top-24">
            <FilterControls/>
        </aside>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:col-span-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProducts.length > 0 ? (
             filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
             <p className="col-span-full text-center text-muted-foreground py-10">No products found matching your criteria.</p>
          )}

        </motion.div>
      </div>
    </div>
  );
}

