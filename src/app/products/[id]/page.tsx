
"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import { ShoppingCart, Heart, Share2, Zap } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn utility
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Sample Product Data - In a real app, fetch this based on ID
const allProducts: Candle[] = [
    { id: '1', name: 'Sunrise Citrus', scentCategory: 'Citrus', price: 28, imageUrl: 'https://images.unsplash.com/photo-1697587454797-8644fcb7e242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjaXRydXMlMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Awaken your senses with the bright and zesty aroma of freshly squeezed lemons and sweet oranges, reminiscent of a sun-drenched morning.', scentNotes: 'Top: Lemon Peel, Bergamot | Middle: Sweet Orange, Neroli | Base: Cedarwood', burnTime: 'Approx. 40-45 hours', ingredients: '100% Natural Soy Wax, Premium Essential Oils, Cotton Wick' },
    { id: '2', name: 'Lavender Dreams', scentCategory: 'Floral', price: 32, imageUrl: 'https://images.unsplash.com/photo-1619799360851-a143fbc240b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmbG9yYWwlMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Drift into tranquility with the soothing scent of French lavender, blended with calming chamomile and a hint of warm vanilla.', scentNotes: 'Top: Lavender | Middle: Chamomile, Sage | Base: Vanilla, Sandalwood', burnTime: 'Approx. 45-50 hours', ingredients: 'Natural Soy Wax Blend, Natural Fragrance Oils, Cotton Wick' },
    { id: '3', name: 'Vanilla Bean Bliss', scentCategory: 'Sweet', price: 30, imageUrl: 'https://images.unsplash.com/photo-1604249180535-583716d9ec33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzd2VldCUyMGNhbmRsZXxlbnwwfHx8fDE3NDg2OTE1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Indulge in the comforting and rich fragrance of pure vanilla bean, enhanced with notes of sweet buttercream and a touch of caramel.', scentNotes: 'Top: Buttercream | Middle: Vanilla Bean, Cake | Base: Sugar, Bourbon', burnTime: 'Approx. 50-55 hours', ingredients: 'Coconut & Soy Wax Blend, Phthalate-Free Fragrance Oils, Wooden Wick' },
    { id: '4', name: 'Mint Mojito', scentCategory: 'Fresh', price: 29, imageUrl: 'https://images.unsplash.com/photo-1645602996177-e30e95e58c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmcmVzaCUyMGNhbmRsZXxlbnwwfHx8fDE3NDg2OTE1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080', description: 'A refreshing and invigorating blend of cool spearmint, zesty lime, and a touch of sweetness, like a perfectly crafted mojito.', scentNotes: 'Top: Lime, Mint | Middle: Jasmine, Pineapple | Base: Rum, Sugar', burnTime: 'Approx. 40-45 hours', ingredients: '100% Natural Soy Wax, Essential Oils, Cotton Wick' },
    { id: '5', name: 'Rose Garden', scentCategory: 'Floral', price: 35, imageUrl: 'https://images.unsplash.com/photo-1619799360851-a143fbc240b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxmbG9yYWwlMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Stroll through a blooming garden with the delicate and romantic aroma of fresh-cut roses and soft geranium petals.', scentNotes: 'Top: Rose Petals, Green Leaves | Middle: Geranium, Violet | Base: Musk, Floral Musk', burnTime: 'Approx. 45-50 hours', ingredients: 'Natural Soy Wax Blend, Natural Fragrance Oils, Cotton Wick' },
    { id: '6', name: 'Spiced Apple', scentCategory: 'Fruity', price: 31, imageUrl: 'https://images.unsplash.com/photo-1625055887171-4a3186a42b39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxmcnVpdHklMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Cozy up with the warm and inviting scent of baked apples dusted with spicy cinnamon and a hint of clove.', scentNotes: 'Top: Red Apple, Orange Peel | Middle: Cinnamon, Clove, Nutmeg | Base: Vanilla, Pie Crust', burnTime: 'Approx. 48-52 hours', ingredients: 'Soy Wax Blend, Phthalate-Free Fragrance Oils, Cotton Wick' },
    { id: '7', name: 'Ocean Breeze', scentCategory: 'Fresh', price: 33, imageUrl: 'https://images.unsplash.com/photo-1499950617211-a8609a16ad72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZnJlc2glMjBjYW5kbGV8ZW58MHx8fHwxNzQ4NjkxNTA0fDA&ixlib=rb-4.1.0&q=80&w=1080', description: 'Capture the essence of a coastal getaway with this crisp blend of sea salt, ozonic air, and hints of floral notes.', scentNotes: 'Top: Ozone, Sea Salt | Middle: Jasmine, Lily of the Valley | Base: Wood, Tonka Bean', burnTime: 'Approx. 42-48 hours', ingredients: 'Soy Wax, Phthalate-Free Fragrance Oils, Cotton Wick' },
    { id: '8', name: 'Peach Paradise', scentCategory: 'Fruity', price: 27, imageUrl: 'https://images.unsplash.com/photo-1603959452586-78397d087b62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZnJ1aXR5JTIwY2FuZGxlfGVufDB8fHx8MTc0ODY5MTUwNHww&ixlib=rb-4.1.0&q=80&w=1080', description: 'Escape to a tropical oasis with the sweet and juicy fragrance of ripe peaches, blended with exotic mango and creamy coconut.', scentNotes: 'Top: Ripe Peach, Bergamot | Middle: Mango, Coconut | Base: Vanilla, Sugar', burnTime: 'Approx. 38-42 hours', ingredients: 'Soy Wax, Phthalate-Free Fragrance Oils, Cotton Wick' },
];

// Fetch product data
async function getProduct(id: string): Promise<Candle | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate API delay
  return allProducts.find(p => p.id === id);
}

// Fetch related products
async function getRelatedProducts(currentCategory: string, currentId: string): Promise<Candle[]> {
   await new Promise(resolve => setTimeout(resolve, 50));
   return allProducts.filter(p => p.scentCategory === currentCategory && p.id !== currentId).slice(0, 4);
}

const getGradientClass = (category: Candle['scentCategory']): string => {
    switch (category) {
        case 'Citrus': return 'bg-gradient-to-br from-accent/20 via-background to-accent/10';
        case 'Floral': return 'bg-gradient-to-br from-muted/20 via-background to-muted/10';
        case 'Sweet': return 'bg-gradient-to-br from-secondary/20 via-background to-secondary/10';
        case 'Fresh': return 'bg-gradient-to-br from-primary/20 via-background to-primary/10';
        case 'Fruity': return 'bg-gradient-to-br from-secondary/20 via-background to-accent/10';
        default: return 'bg-gradient-to-br from-background via-gray-100 to-background';
    }
};


export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = React.useState<Candle | null>(null);
  const [relatedProducts, setRelatedProducts] = React.useState<Candle[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [ripple, setRipple] = React.useState({ x: -1, y: -1, show: false });
  const { toast } = useToast();

  const [wishlistedItems, setWishlistedItems] = React.useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const storedWishlist = localStorage.getItem('kraftikaWishlist');
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    }
    return [];
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kraftikaWishlist', JSON.stringify(wishlistedItems));
    }
  }, [wishlistedItems]);

  React.useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        const fetchedProduct = await getProduct(params.id);
        if (fetchedProduct) {
            setProduct(fetchedProduct);
            const fetchedRelated = await getRelatedProducts(fetchedProduct.scentCategory, fetchedProduct.id);
            setRelatedProducts(fetchedRelated);
        } else {
            notFound();
        }
        setIsLoading(false);
    }
    fetchData();
  }, [params.id]);

   const handleAddToCartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
       const rect = event.currentTarget.getBoundingClientRect();
       const x = event.clientX - rect.left;
       const y = event.clientY - rect.top;
       setRipple({ x, y, show: true });
       setTimeout(() => setRipple(prev => ({ ...prev, show: false })), 600);
       // TODO: Add actual cart logic here
       console.log(`Add ${product?.name} to cart`);
       toast({
         title: "Added to Cart!",
         description: `${product?.name} is now in your shopping bag.`,
       });
   };

  const isWishlisted = product ? wishlistedItems.includes(product.id) : false;

  const toggleWishlist = () => {
    if (!product) return;
    const wasWishlisted = wishlistedItems.includes(product.id);
    setWishlistedItems(prevItems => {
      if (prevItems.includes(product.id)) {
        return prevItems.filter((id: string) => id !== product.id);
      } else {
        return [...prevItems, product.id];
      }
    });
    if (wasWishlisted) {
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      toast({
        title: "Added to Wishlist!",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto max-w-7xl px-4 py-16 text-center min-h-screen flex items-center justify-center">Loading product details...</div>;
  }

  if (!product) {
     return notFound();
  }

  const gradientClass = getGradientClass(product.scentCategory);
  const images = [
    product.imageUrl,
    product.imageUrl.includes('unsplash.com') ? `${product.imageUrl}&random=1` : `https://images.unsplash.com/photo-1612199113196-8918ccba0111?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjYW5kbGUlMjBsaWZlc3R5bGV8ZW58MHx8fHwxNzQ4NjkxNzA0fDA&ixlib=rb-4.1.0&q=80&w=800`,
    product.imageUrl.includes('unsplash.com') ? `${product.imageUrl}&random=2` : `https://images.unsplash.com/photo-1587190008733-da3930e91cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxjYW5kbGUlMjBwYWNrYWdpbmd8ZW58MHx8fHwxNzQ4NjkxNzA0fDA&ixlibrb-4.1.0&q=80&w=800`,
    product.imageUrl.includes('unsplash.com') ? `${product.imageUrl}&random=3` : `https://images.unsplash.com/photo-1515277927504-60732d80260d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzMHx8Y2FuZGxlJTIwZGV0YWlsfGVufDB8fHx8MTc0ODY5MTcwNXww&ixlib.rb-4.1.0&q=80&w=800`,
  ];

  return (
    <div className={`w-full min-h-screen ${gradientClass}`}>
        <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 items-start"
        >
            <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="w-full md:sticky md:top-24"
            >
            <Carousel className="w-full rounded-lg overflow-hidden shadow-xl glassmorphism p-2 border border-[hsl(var(--border)/0.1)]">
                <CarouselContent>
                {images.map((imgUrl, index) => (
                    <CarouselItem key={index}>
                    <div className="aspect-[4/5] relative">
                        <Image
                        src={imgUrl}
                        alt={`${product.name} - view ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        className="object-cover rounded-md"
                        priority={index === 0}
                        data-ai-hint={`${product.scentCategory.toLowerCase()} candle lifestyle ${index > 0 ? 'detail' : ''}`.trim()}
                        />
                    </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-background/50 hover:bg-background/80 border-border/30" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-background/50 hover:bg-background/80 border-border/30" />
            </Carousel>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col space-y-6 glassmorphism p-6 md:p-8 border border-[hsl(var(--border)/0.2)]"
            >
            <Badge variant="secondary" className="w-fit bg-secondary/80 text-secondary-foreground">{product.scentCategory}</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {product.name}
            </h1>
            <p className="text-2xl font-semibold text-primary">
                ₹{product.price.toFixed(2)}
            </p>
            <Separator className="bg-border/30" />

            <div className="space-y-3">
                <h3 className="font-semibold text-lg text-foreground/90">Description</h3>
                <p className="text-muted-foreground/80 leading-relaxed">{product.description}</p>
            </div>

            <div className="space-y-3">
                <h3 className="font-semibold text-lg text-foreground/90">Scent Notes</h3>
                <p className="text-muted-foreground/80">{product.scentNotes}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <h4 className="font-medium text-foreground/90 mb-1">Burn Time</h4>
                    <p className="text-muted-foreground/80">{product.burnTime}</p>
                </div>
                <div>
                    <h4 className="font-medium text-foreground/90 mb-1">Ingredients</h4>
                    <p className="text-muted-foreground/80">{product.ingredients}</p>
                </div>
            </div>

            <Separator className="bg-border/30" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 pt-2">
                 <Button
                    size="lg"
                    className="relative w-full sm:flex-1 btn-primary overflow-hidden px-4 sm:px-8"
                    onClick={handleAddToCartClick}
                 >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                    {ripple.show && (
                        <motion.span
                            className="absolute block rounded-full bg-primary-foreground/30 pointer-events-none"
                            style={{ left: ripple.x, top: ripple.y, x: '-50%', y: '-50%' }}
                            initial={{ width: 0, height: 0, opacity: 0.5 }}
                            animate={{ width: '200%', height: '200%', opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        />
                    )}
                 </Button>

                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        className={cn(
                            "border-border/30 transition-colors duration-200",
                            isWishlisted
                              ? "border-destructive/40 bg-destructive/5 hover:bg-destructive/10 text-destructive"
                              : "hover:bg-muted/50 hover:text-muted-foreground text-muted-foreground"
                          )}
                        onClick={toggleWishlist}
                    >
                        <Heart
                          className={cn("h-5 w-5")}
                          fill={isWishlisted ? "currentColor" : "none"}
                        />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Share Product" className="border-border/30 hover:bg-muted/50 text-muted-foreground hover:text-muted-foreground">
                        <Share2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            </motion.div>
        </motion.div>

        {relatedProducts.length > 0 && (
            <div className="mt-16 md:mt-24 pt-10 border-t border-border/20">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-center text-foreground sm:text-3xl">
                You Might Also Like
            </h2>
            <motion.div
                initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, amount: 0.1 }}
                 variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
                {relatedProducts.map((relatedProduct) => (
                 <motion.div key={relatedProduct.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                     <ProductCard product={relatedProduct} />
                 </motion.div>
                ))}
            </motion.div>
            </div>
        )}
        </div>
    </div>
  );
}


    