"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductCard } from "@/components/product-card";
import type { Candle } from "@/types/candle";
import type { Review } from "@/types/review";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  MessageSquareText, 
  Image as ImageIcon, 
  Video, 
  Play,
  Clock,
  Leaf,
  Sparkles,
  CheckCircle2,
  Shield,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { addItemToCart } from "@/services/cart-sync";

interface ProductDetailClientProps {
  product: Candle;
  relatedProducts: Candle[];
  reviews: Review[];
}

// Helper to create media items (images and videos)
const createMediaItems = (product: Candle): Array<{ type: 'image' | 'video'; url: string }> => {
  const items: Array<{ type: 'image' | 'video'; url: string }> = [];
  
  if (product.imageUrl) {
    items.push({ type: 'image', url: product.imageUrl });
  }
  
  if (product.videoUrl) {
    items.push({ type: 'video', url: product.videoUrl });
  }
  
  if (product.videoUrls && product.videoUrls.length > 0) {
    product.videoUrls.forEach(videoUrl => {
      items.push({ type: 'video', url: videoUrl });
    });
  }
  
  return items;
};

export function ProductDetailClient({ product, relatedProducts, reviews }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [ripple, setRipple] = React.useState({ x: -1, y: -1, show: false });
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
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
  const mediaItems = createMediaItems(product);
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const handleAddToCartClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!product || isAddingToCart) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setRipple({ x, y, show: true });
    setIsAddingToCart(true);
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
          setIsAddingToCart(false);
        },
        (error) => {
          toast({
            title: "Error",
            description: error.message || "Could not add item to cart. Please try again.",
            variant: "destructive",
          });
          setIsAddingToCart(false);
        }
      );
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setIsAddingToCart(false);
    }
  };

  const isWishlisted = wishlistedItems.includes(product.id);

  const toggleWishlist = () => {
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

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = product.name;
    const shareText = product.description || `Check out ${product.name} from Kraftika`;

    // Try Web Share API first (works on mobile and some desktop browsers)
    if (navigator.share && navigator.canShare && navigator.canShare({ url: shareUrl })) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast({
          title: "Shared!",
          description: "Product link has been shared.",
        });
        return;
      } catch (error: any) {
        // User cancelled or error occurred - fall through to clipboard
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    }

    // Fallback: copy to clipboard
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied!",
          description: "Product link has been copied to clipboard.",
        });
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          toast({
            title: "Link Copied!",
            description: "Product link has been copied to clipboard.",
          });
        } catch (err) {
          console.error('Failed to copy:', err);
          toast({
            title: "Error",
            description: "Could not copy link. Please copy manually: " + shareUrl,
            variant: "destructive",
          });
        }
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      toast({
        title: "Error",
        description: "Could not copy link. Please copy manually: " + shareUrl,
        variant: "destructive",
      });
    }
  };

  // Feature highlights data
  const features = [
    {
      icon: Leaf,
      label: "100% Natural",
      value: "Soy Wax",
      color: "text-green-600"
    },
    {
      icon: Clock,
      label: "Burn Time",
      value: product.burnTime,
      color: "text-blue-600"
    },
    {
      icon: Sparkles,
      label: "Scent Category",
      value: product.scentCategory,
      color: "text-purple-600"
    }
  ];

  // Product highlights
  const highlights = [
    { text: "Handcrafted with premium ingredients" },
    { text: "Long-lasting fragrance" },
    { text: "Eco-friendly packaging" }
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
              <span className="text-xs text-gray-500">Inclusive of taxes</span>
            </div>
            <Button
              size="lg"
              className="flex-1 h-12 text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white"
              onClick={handleAddToCartClick}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                "Adding..."
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6 lg:py-8 pb-24 md:pb-16">
        {/* Back Button - Mobile */}
        <Button
          variant="ghost"
          className="mb-6 md:hidden -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 items-start"
        >
          {/* Left Section - Image Gallery */}
          <div className="w-full space-y-3 max-w-lg mx-auto lg:max-w-none">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative aspect-square lg:aspect-[3/4] w-full max-w-[400px] mx-auto lg:max-w-[450px] rounded-xl overflow-hidden bg-gray-50 border border-gray-200"
            >
              {mediaItems.length > 0 ? (
                <AnimatePresence mode="wait">
                  {mediaItems[selectedImageIndex]?.type === 'video' ? (
                    <motion.div
                      key={`video-${selectedImageIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      <video
                        src={mediaItems[selectedImageIndex].url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full p-2">
                        <Video className="h-5 w-5 text-white" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`image-${selectedImageIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full relative"
                    >
                      <Image
                        src={mediaItems[selectedImageIndex]?.url || product.imageUrl}
                        alt={`${product.name} - View ${selectedImageIndex + 1}`}
                        fill
                        sizes="(max-width: 640px) 400px, (max-width: 1024px) 450px, 450px"
                        className="object-cover"
                        priority={selectedImageIndex === 0}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : (
                <div className="w-full h-full relative">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 400px, (max-width: 1024px) 450px, 450px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </motion.div>

            {/* Thumbnail Navigation */}
            {mediaItems.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {mediaItems.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200",
                      selectedImageIndex === index
                        ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2"
                        : "border-gray-200 hover:border-gray-400"
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
                        sizes="(max-width: 1024px) 25vw, 150px"
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Section - Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col space-y-3"
          >
            {/* Category Badge & Rating */}
            <div className="flex items-center justify-between gap-4">
              <Badge 
                variant="secondary" 
                className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 border-0"
              >
                {product.scentCategory}
              </Badge>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.round(averageRating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({reviews.length})
                  </span>
                </div>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">Inclusive of all taxes</span>
            </div>

            <Separator className="bg-gray-200" />

            {/* Description */}
            <div className="space-y-2">
              <p className="text-sm text-gray-700 leading-snug line-clamp-4">
                {product.description}
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <feature.icon className={cn("h-5 w-5 mb-1.5", feature.color)} />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                    {feature.label}
                  </p>
                  <p className="text-xs font-semibold text-gray-900">
                    {feature.value}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Highlights */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                Highlights
              </h3>
              <div className="space-y-1.5">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-700">{highlight.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Additional Details */}
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Scent Notes
                </h4>
                <p className="text-xs font-medium text-gray-900">{product.scentNotes}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Ingredients
                </h4>
                <p className="text-xs font-medium text-gray-900">{product.ingredients}</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Secure Payment</span>
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                size="lg"
                className="relative w-full h-12 text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                onClick={handleAddToCartClick}
                disabled={isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
                {ripple.show && (
                  <motion.span
                    className="absolute block rounded-full bg-white/30 pointer-events-none"
                    style={{ left: ripple.x, top: ripple.y, x: '-50%', y: '-50%' }}
                    initial={{ width: 0, height: 0, opacity: 0.5 }}
                    animate={{ width: '200%', height: '200%', opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-10 text-sm border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  onClick={toggleWishlist}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 mr-2",
                      isWishlisted && "fill-red-500 text-red-500"
                    )}
                  />
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-10 text-sm border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Customer Reviews Section */}
        <div className="mt-16 md:mt-24 pt-10 border-t border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                Customer Reviews
              </h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < Math.round(averageRating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900 ml-2">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {reviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-gray-200"
            >
              <MessageSquareText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="font-medium text-gray-700">No reviews yet for {product.name}.</p>
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
                  <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-gray-200">
                            <AvatarImage src={review.authorAvatarUrl} alt={review.authorName} />
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {review.authorAvatarFallback}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{review.authorName}</p>
                            <p className="text-sm text-gray-500">{review.reviewDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {review.reviewText}
                      </p>
                      {review.reviewImageUrl && (
                        <div className="mt-3 relative aspect-video sm:aspect-[16/6] max-w-sm rounded-lg overflow-hidden border border-gray-200">
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

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-24 pt-10 border-t border-gray-200">
            <h2 className="mb-8 text-2xl md:text-3xl font-bold tracking-tight text-center text-gray-900">
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
