
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
import { ShoppingCart, Heart, Share2, Star, MessageSquareText, Image as ImageIcon, Video, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { addItemToCart } from "@/services/cart-sync";

interface CartStorageItem {
  id: string;
  quantity: number;
}

const getGradientClass = (category: Candle['scentCategory']): string => {
    switch (category) {
        case 'Citrus': return 'bg-gradient-to-br from-orange-50 via-background to-yellow-50 dark:from-orange-950/20 dark:via-background dark:to-yellow-950/20';
        case 'Floral': return 'bg-gradient-to-br from-pink-50 via-background to-purple-50 dark:from-pink-950/20 dark:via-background dark:to-purple-950/20';
        case 'Sweet': return 'bg-gradient-to-br from-rose-50 via-background to-amber-50 dark:from-rose-950/20 dark:via-background dark:to-amber-950/20';
        case 'Fresh': return 'bg-gradient-to-br from-green-50 via-background to-blue-50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20';
        case 'Fruity': return 'bg-gradient-to-br from-red-50 via-background to-orange-50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20';
        default: return 'bg-gradient-to-br from-background via-gray-50 to-background dark:via-gray-950';
    }
};

interface ProductDetailClientProps {
    product: Candle;
    relatedProducts: Candle[];
    reviews: Review[];
}

// Helper to create media items (images and videos)
const createMediaItems = (product: Candle): Array<{ type: 'image' | 'video'; url: string }> => {
  const items: Array<{ type: 'image' | 'video'; url: string }> = [];
  
  // Add main image
  if (product.imageUrl) {
    items.push({ type: 'image', url: product.imageUrl });
  }
  
  // Add single video if exists
  if (product.videoUrl) {
    items.push({ type: 'video', url: product.videoUrl });
  }
  
  // Add video array if exists
  if (product.videoUrls && product.videoUrls.length > 0) {
    product.videoUrls.forEach(videoUrl => {
      items.push({ type: 'video', url: videoUrl });
    });
  }
  
  return items;
};

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

  const { isAuthenticated } = useAuth();

  const handleAddToCartClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!product) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRipple({ x, y, show: true });
    setTimeout(() => setRipple(prev => ({ ...prev, show: false })), 600);
    
    try {
      await addItemToCart(
        product.id,
        1,
        isAuthenticated,
        () => {
          toast({
            title: "Added to Cart!",
            description: `${product.name} has been added to your cart.`,
            onClick: () => router.push('/cart'),
          });
        },
        (error) => {
          toast({
            title: "Error",
            description: error.message || "Could not add item to cart. Please try again.",
            variant: "destructive",
          });
        }
      );
    } catch (error) {
      console.error("Failed to add item to cart:", error);
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
  const mediaItems = createMediaItems(product);

  return (
    <div className={`w-full min-h-screen ${gradientClass} transition-colors duration-300`}>
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:py-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16 items-start"
        >
            {/* Media Gallery Section - Enhanced */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="w-full md:sticky md:top-24 space-y-4"
            >
              <Carousel 
                className="w-full rounded-2xl overflow-hidden shadow-2xl bg-background/50 backdrop-blur-sm border border-border/50"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent className="rounded-2xl">
                  {mediaItems.length > 0 ? (
                    mediaItems.map((media, index) => (
                      <CarouselItem key={index} className="basis-full">
                        <div className="aspect-[4/5] relative group overflow-hidden rounded-xl">
                          {media.type === 'video' ? (
                            <video
                              src={media.url}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Video load error:', e);
                              }}
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <Image
                              src={media.url}
                              alt={`${product.name} - ${product.scentCategory} scented candle ${index === 0 ? 'main view' : `view ${index + 1}`} from Kraftika`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              priority={index === 0}
                            />
                          )}
                          {media.type === 'video' && (
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full p-2">
                              <Video className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem>
                      <div className="aspect-[4/5] relative bg-muted flex items-center justify-center rounded-xl">
                        <ImageIcon className="h-16 w-16 text-muted-foreground" />
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                {mediaItems.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-background/80 hover:bg-background backdrop-blur-sm border-border/50 shadow-lg" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex bg-background/80 hover:bg-background backdrop-blur-sm border-border/50 shadow-lg" />
                  </>
                )}
              </Carousel>

              {/* Thumbnail Navigation */}
              {mediaItems.length > 1 && (
                <div className="grid grid-cols-4 gap-2 md:grid-cols-4">
                  {mediaItems.map((media, index) => (
                    <div
                      key={index}
                      className={cn(
                        "aspect-square relative rounded-lg overflow-hidden border-2 transition-all duration-200 border-border/30 hover:border-border/50 opacity-80 hover:opacity-100"
                      )}
                    >
                      {media.type === 'video' ? (
                        <>
                          <video
                            src={media.url}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="h-4 w-4 text-white" />
                          </div>
                        </>
                      ) : (
                        <Image
                          src={media.url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 25vw, 150px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info Section - Enhanced */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col space-y-6"
            >
              {/* Header Section */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge variant="secondary" className="w-fit bg-secondary/80 text-secondary-foreground text-sm px-3 py-1">
                    {product.scentCategory}
                  </Badge>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border/30">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-foreground text-sm">{averageRating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({reviews.length})</span>
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
                    {product.name}
                </h1>
                
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                      ₹{product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Description Section */}
              <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-foreground">Description</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">{product.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/30">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Scent Notes</h4>
                      <p className="text-foreground font-medium">{product.scentNotes}</p>
                  </div>
                  <div className="space-y-2 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/30">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Burn Time</h4>
                      <p className="text-foreground font-medium">{product.burnTime}</p>
                  </div>
                  <div className="space-y-2 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/30 sm:col-span-2">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Ingredients</h4>
                      <p className="text-foreground font-medium">{product.ingredients}</p>
                  </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                  <Button
                      size="lg"
                      className="relative w-full h-12 text-base font-semibold overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
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

                  <div className="flex items-center justify-center gap-3">
                      <Button
                          variant="outline"
                          size="lg"
                          className="flex-1 border-2"
                          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                          onClick={toggleWishlist}
                      >
                          <Heart
                            className={cn("h-5 w-5 mr-2", isWishlisted && "fill-current text-destructive")}
                          />
                          {isWishlisted ? "Wishlisted" : "Wishlist"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="flex-1 border-2"
                        aria-label="Share Product"
                      >
                          <Share2 className="h-5 w-5 mr-2" />
                          Share
                      </Button>
                  </div>
              </div>
            </motion.div>
        </motion.div>

        {/* Customer Reviews Section - Enhanced */}
        <div className="mt-16 md:mt-24 pt-10 border-t border-border/20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center"
            >
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
                    Customer Reviews
                </h2>
                {reviews.length > 0 && (
                    <div className="flex items-center justify-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                            key={i}
                            className={cn(
                                "h-6 w-6 transition-colors",
                                i < Math.round(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                            )}
                            />
                        ))}
                        <span className="ml-2 font-semibold text-foreground text-lg">{averageRating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">({reviews.length} review{reviews.length === 1 ? '' : 's'})</span>
                    </div>
                )}
            </motion.div>

            {reviews.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-center py-12 text-muted-foreground bg-background/50 backdrop-blur-sm rounded-2xl border border-border/30"
                >
                    <MessageSquareText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="font-medium">No reviews yet for {product.name}.</p>
                    <p className="text-sm mt-1">Be the first to share your thoughts!</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Card className="bg-background/50 backdrop-blur-sm border-border/30 hover:border-border/50 transition-colors">
                                <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-11 w-11 border-2 border-border/30">
                                            <AvatarImage src={review.authorAvatarUrl} alt={review.authorName} />
                                            <AvatarFallback>{review.authorAvatarFallback}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm text-foreground">{review.authorName}</p>
                                            <p className="text-xs text-muted-foreground">{review.reviewDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                            "h-4 w-4",
                                            i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                                            )}
                                        />
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 pt-0">
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{review.reviewText}</p>
                                    {review.reviewImageUrl && (
                                        <div className="mt-3 relative aspect-video sm:aspect-[16/6] max-w-sm rounded-lg overflow-hidden border border-border/30">
                                            <Image
                                                src={review.reviewImageUrl}
                                                alt={`Review image by ${review.authorName}`}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 384px"
                                                className="object-cover"
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

        {/* Related Products Section - Enhanced */}
        {relatedProducts.length > 0 && (
            <div className="mt-16 md:mt-24 pt-10 border-t border-border/20">
            <h2 className="mb-8 text-2xl md:text-3xl font-bold tracking-tight text-center text-foreground">
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
                 <motion.div 
                   key={relatedProduct.id} 
                   variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                 >
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
