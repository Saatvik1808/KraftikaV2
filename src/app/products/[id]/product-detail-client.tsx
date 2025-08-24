
"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import type { Review } from "@/types/review";
import { ShoppingCart, Heart, Share2, Star, MessageSquareText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CartStorageItem {
  id: string;
  quantity: number;
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

interface ProductDetailClientProps {
    product: Candle;
    relatedProducts: Candle[];
    reviews: Review[];
}

export function ProductDetailClient({ product, relatedProducts, reviews }: ProductDetailClientProps) {
  const [ripple, setRipple] = React.useState({ x: -1, y: -1, show: false });
  const { toast } = useToast();
  const router = useRouter(); 

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

  const handleAddToCartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!product) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRipple({ x, y, show: true });
    setTimeout(() => setRipple(prev => ({ ...prev, show: false })), 600);
    
    try {
      const cartString = localStorage.getItem('kraftikaCart');
      let currentCart: CartStorageItem[] = cartString ? JSON.parse(cartString) : [];
      
      const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity += 1;
      } else {
        currentCart.push({ id: product.id, quantity: 1 });
      }
      
      localStorage.setItem('kraftikaCart', JSON.stringify(currentCart));
      
      toast({
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart.`,
        onClick: () => router.push('/cart'),
      });

    } catch (error) {
      console.error("Failed to update cart in localStorage", error);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    }
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
    toast({
      title: wasWishlisted ? "Removed from Wishlist" : "Added to Wishlist!",
      description: `${product.name} has been ${wasWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  const gradientClass = getGradientClass(product.scentCategory);
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

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
                  {[product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl].map((imgUrl, index) => (
                      <CarouselItem key={index}>
                      <div className="aspect-[4/5] relative">
                          {imgUrl ? (
                            <Image
                              src={imgUrl}
                              alt={`${product.name} - view ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                              className="object-cover rounded-md"
                              priority={index === 0} 
                              data-ai-hint={`handcrafted candle ${index > 0 ? 'detail view' : 'main view'}`.trim()}
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center rounded-md">
                              <ImageIcon className="h-16 w-16 text-muted-foreground" />
                            </div>
                          )}
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
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="w-fit bg-secondary/80 text-secondary-foreground">{product.scentCategory}</Badge>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-accent-foreground fill-accent-foreground" />
                    <span className="font-semibold text-foreground/90">{averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground/80">({reviews.length} reviews)</span>
                  </div>
                )}
              </div>
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

        {/* Customer Reviews Section */}
        <div className="mt-16 md:mt-24 pt-10 border-t border-border/20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center"
            >
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Customer Reviews
                </h2>
                {reviews.length > 0 && (
                    <div className="mt-2 flex items-center justify-center gap-1.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                            key={i}
                            className={cn(
                                "h-6 w-6",
                                i < Math.round(averageRating) ? "text-accent-foreground fill-accent-foreground" : "text-muted-foreground/50"
                            )}
                            />
                        ))}
                        <span className="ml-1 font-semibold text-foreground/90">{averageRating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">({reviews.length} review{reviews.length === 1 ? '' : 's'})</span>
                    </div>
                )}
            </motion.div>

            {reviews.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-center py-8 text-muted-foreground glassmorphism p-6"
                >
                    <MessageSquareText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p>No reviews yet for {product.name}.</p>
                    <p className="text-sm">Be the first to share your thoughts!</p>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card className="glassmorphism p-5 border border-[hsl(var(--border)/0.15)]">
                                <CardHeader className="p-0 mb-3 flex flex-row items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border">
                                            <AvatarImage src={review.authorAvatarUrl} alt={review.authorName} data-ai-hint="person avatar" />
                                            <AvatarFallback>{review.authorAvatarFallback}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm text-foreground/90">{review.authorName}</p>
                                            <p className="text-xs text-muted-foreground">{review.reviewDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                            "h-4 w-4",
                                            i < review.rating ? "text-accent-foreground fill-accent-foreground" : "text-muted-foreground/50"
                                            )}
                                        />
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <p className="text-sm text-muted-foreground/80 leading-relaxed mb-3">{review.reviewText}</p>
                                    {review.reviewImageUrl && (
                                        <div className="mt-3 relative aspect-video sm:aspect-[16/6] max-w-sm rounded-md overflow-hidden">
                                            <Image
                                                src={review.reviewImageUrl}
                                                alt={`Review image by ${review.authorName}`}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 384px"
                                                className="object-cover"
                                                data-ai-hint="product review photo"
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>

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
                {relatedProducts.map((relatedProduct, index) => (
                 <motion.div key={relatedProduct.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                     <ProductCard product={relatedProduct} priority={index < 2} />
                 </motion.div>
                ))}
            </motion.div>
            </div>
        )}
        </div>
    </div>
  );
}
