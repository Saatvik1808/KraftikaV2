"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { notFound } from "next/navigation"; // Use notFound for invalid IDs
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import { ShoppingCart, Heart, Share2 } from "lucide-react";

// Sample Product Data - In a real app, fetch this based on ID
const allProducts: Candle[] = [
    { id: '1', name: 'Sunrise Citrus', scentCategory: 'Citrus', price: 28, imageUrl: 'https://picsum.photos/seed/candle1/600/800', description: 'Awaken your senses with the bright and zesty aroma of freshly squeezed lemons and sweet oranges, reminiscent of a sun-drenched morning.', scentNotes: 'Top: Lemon Peel, Bergamot | Middle: Sweet Orange, Neroli | Base: Cedarwood', burnTime: 'Approx. 40-45 hours', ingredients: '100% Natural Soy Wax, Premium Essential Oils, Cotton Wick' },
    { id: '2', name: 'Lavender Dreams', scentCategory: 'Floral', price: 32, imageUrl: 'https://picsum.photos/seed/candle2/600/800', description: 'Drift into tranquility with the soothing scent of French lavender, blended with calming chamomile and a hint of warm vanilla.', scentNotes: 'Top: Lavender | Middle: Chamomile, Sage | Base: Vanilla, Sandalwood', burnTime: 'Approx. 45-50 hours', ingredients: 'Natural Soy Wax Blend, Natural Fragrance Oils, Cotton Wick' },
    { id: '3', name: 'Vanilla Bean Bliss', scentCategory: 'Sweet', price: 30, imageUrl: 'https://picsum.photos/seed/candle3/600/800', description: 'Indulge in the comforting and rich fragrance of pure vanilla bean, enhanced with notes of sweet buttercream and a touch of caramel.', scentNotes: 'Top: Buttercream | Middle: Vanilla Bean, Cake | Base: Sugar, Bourbon', burnTime: 'Approx. 50-55 hours', ingredients: 'Coconut & Soy Wax Blend, Phthalate-Free Fragrance Oils, Wooden Wick' },
     { id: '4', name: 'Mint Mojito', scentCategory: 'Fresh', price: 29, imageUrl: 'https://picsum.photos/seed/candle4/600/800', description: 'A refreshing and invigorating blend of cool spearmint, zesty lime, and a touch of sweetness, like a perfectly crafted mojito.', scentNotes: 'Top: Lime, Mint | Middle: Jasmine, Pineapple | Base: Rum, Sugar', burnTime: 'Approx. 40-45 hours', ingredients: '100% Natural Soy Wax, Essential Oils, Cotton Wick' },
     { id: '5', name: 'Rose Garden', scentCategory: 'Floral', price: 35, imageUrl: 'https://picsum.photos/seed/candle5/600/800', description: 'Stroll through a blooming garden with the delicate and romantic aroma of fresh-cut roses and soft geranium petals.', scentNotes: 'Top: Rose Petals, Green Leaves | Middle: Geranium, Violet | Base: Musk, Floral Musk', burnTime: 'Approx. 45-50 hours', ingredients: 'Natural Soy Wax Blend, Natural Fragrance Oils, Cotton Wick' },
     { id: '6', name: 'Spiced Apple', scentCategory: 'Fruity', price: 31, imageUrl: 'https://picsum.photos/seed/candle6/600/800', description: 'Cozy up with the warm and inviting scent of baked apples dusted with spicy cinnamon and a hint of clove.', scentNotes: 'Top: Red Apple, Orange Peel | Middle: Cinnamon, Clove, Nutmeg | Base: Vanilla, Pie Crust', burnTime: 'Approx. 48-52 hours', ingredients: 'Soy Wax Blend, Phthalate-Free Fragrance Oils, Cotton Wick' },
     { id: '7', name: 'Ocean Breeze', scentCategory: 'Fresh', price: 33, imageUrl: 'https://picsum.photos/seed/candle7/600/800', description: 'Capture the essence of a coastal getaway with this crisp blend of sea salt, ozonic air, and hints of floral notes.', scentNotes: 'Top: Ozone, Sea Salt | Middle: Jasmine, Lily of the Valley | Base: Wood, Tonka Bean', burnTime: 'Approx. 42-48 hours', ingredients: 'Soy Wax, Phthalate-Free Fragrance Oils, Cotton Wick' },
     { id: '8', name: 'Peach Paradise', scentCategory: 'Fruity', price: 27, imageUrl: 'https://picsum.photos/seed/candle8/600/800', description: 'Escape to a tropical oasis with the sweet and juicy fragrance of ripe peaches, blended with exotic mango and creamy coconut.', scentNotes: 'Top: Ripe Peach, Bergamot | Middle: Mango, Coconut | Base: Vanilla, Sugar', burnTime: 'Approx. 38-42 hours', ingredients: 'Soy Wax, Phthalate-Free Fragrance Oils, Cotton Wick' },
];

// Fetch product data (replace with actual API call)
async function getProduct(id: string): Promise<Candle | undefined> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return allProducts.find(p => p.id === id);
}

// Fetch related products (replace with actual logic)
async function getRelatedProducts(currentCategory: string, currentId: string): Promise<Candle[]> {
   await new Promise(resolve => setTimeout(resolve, 100));
   return allProducts.filter(p => p.scentCategory === currentCategory && p.id !== currentId).slice(0, 4); // Get 4 related
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = React.useState<Candle | null>(null);
  const [relatedProducts, setRelatedProducts] = React.useState<Candle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        const fetchedProduct = await getProduct(params.id);
        if (fetchedProduct) {
            setProduct(fetchedProduct);
            const fetchedRelated = await getRelatedProducts(fetchedProduct.scentCategory, fetchedProduct.id);
            setRelatedProducts(fetchedRelated);
        } else {
            notFound(); // Trigger 404 if product not found
        }
        setIsLoading(false);
    }
    fetchData();
  }, [params.id]);

  if (isLoading) {
    // Optional: Add a loading skeleton here
    return <div className="container mx-auto max-w-7xl px-4 py-16 text-center">Loading product details...</div>;
  }

  if (!product) {
     // This should ideally be handled by notFound(), but as a fallback:
     return <div className="container mx-auto max-w-7xl px-4 py-16 text-center">Product not found.</div>;
  }

  // Sample images for carousel (replace with actual product images)
  const images = [
    product.imageUrl,
    `https://picsum.photos/seed/${product.id}-alt1/600/800`,
    `https://picsum.photos/seed/${product.id}-alt2/600/800`,
    `https://picsum.photos/seed/${product.id}-alt3/600/800`,
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
      >
        {/* Image Carousel */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2, duration: 0.5 }}
           className="w-full"
        >
          <Carousel className="w-full rounded-lg overflow-hidden shadow-lg glassmorphism p-2">
            <CarouselContent>
              {images.map((imgUrl, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={imgUrl}
                      alt={`${product.name} - view ${index + 1}`}
                      fill // Use fill for responsive aspect ratio
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px" // Optimize image loading
                      className="object-cover rounded-md"
                      priority={index === 0} // Prioritize the first image
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
             <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
             <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
          </Carousel>
        </motion.div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
           <Badge variant="secondary" className="w-fit">{product.scentCategory}</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold text-primary">
            ${product.price.toFixed(2)}
          </p>
          <Separator />

           <div className="space-y-3">
               <h3 className="font-semibold text-lg">Description</h3>
               <p className="text-muted-foreground leading-relaxed">{product.description}</p>
           </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Scent Notes</h3>
            <p className="text-muted-foreground">{product.scentNotes}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-1">Burn Time</h4>
                <p className="text-muted-foreground">{product.burnTime}</p>
              </div>
               <div>
                <h4 className="font-medium text-foreground mb-1">Ingredients</h4>
                <p className="text-muted-foreground">{product.ingredients}</p>
              </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-primary/30 transition-shadow">
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <div className="flex items-center justify-center gap-2">
                <Button variant="outline" size="icon" aria-label="Add to Wishlist">
                    <Heart className="h-5 w-5" />
                </Button>
                 <Button variant="outline" size="icon" aria-label="Share Product">
                    <Share2 className="h-5 w-5" />
                </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 md:mt-24">
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-center text-foreground sm:text-3xl">
            You Might Also Like
          </h2>
          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true, amount: 0.2 }}
             transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
