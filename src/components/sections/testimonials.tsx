
"use client";

import { Star, Sparkles } from "lucide-react"; // Added Sparkles for effect
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { motion } from "framer-motion";
// import { BackgroundParticles } from "@/components/background-particles"; // Optional particle effect


// Sample Testimonial Data
const testimonials = [
  { name: "Priya S.", quote: "Kraftika candles smell absolutely divine! The Sunrise Citrus brightens my whole morning. ✨", avatar: "https://picsum.photos/seed/avatar1/100", rating: 5, fallback: "PS" },
  { name: "Rohan K.", quote: "The Lavender Dreams candle is so calming. Perfect for winding down after a long day. 💜", avatar: "https://picsum.photos/seed/avatar2/100", rating: 5, fallback: "RK" },
  { name: "Aisha M.", quote: "Beautiful packaging and even better scents. Vanilla Bean Bliss is my favorite! Highly recommend. 😊", avatar: "https://picsum.photos/seed/avatar3/100", rating: 4, fallback: "AM" },
  { name: "Vikram P.", quote: "High-quality candles with unique scents. The Mint Mojito is incredibly refreshing. Will buy again! 🌿", avatar: "https://picsum.photos/seed/avatar4/100", rating: 5, fallback: "VP" },
];

export function Testimonials() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-pink relative overflow-hidden"> {/* Blush Pink Gradient */}
      {/* Optional: Add subtle background particles */}
      {/* <BackgroundParticles /> */}

       {/* Optional: Add curved divider */}
       {/* <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent section-divider" style={{ clipPath: 'ellipse(100% 50% at 50% 100%)' }}></div> */}


      <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, amount: 0.3 }}
           transition={{ duration: 0.5 }}
           className="mb-10 text-center md:mb-14"
        >
          <Sparkles className="mx-auto h-10 w-10 text-primary mb-3 opacity-80" />
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Words of Delight
          </h2>
          <p className="mt-3 text-lg text-muted-foreground/90 md:mt-4">
            See why our customers love the Kraftika experience.
          </p>
        </motion.div>

         <Carousel
           opts={{
             align: "start",
             loop: true,
           }}
           className="w-full max-w-xs sm:max-w-xl lg:max-w-4xl mx-auto"
         >
           <CarouselContent className="-ml-4"> {/* Offset for spacing */}
             {testimonials.map((testimonial, index) => (
               <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3"> {/* Spacing */}
                 <motion.div
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true, amount: 0.2 }}
                   transition={{ duration: 0.4, delay: index * 0.1 }}
                   className="p-1 h-full"
                 >
                   {/* Apply glassmorphism to the Card */}
                   <Card className="h-full flex flex-col justify-between glassmorphism overflow-hidden border border-[hsl(var(--border)/0.2)] shadow-lg">
                      <CardHeader className="flex flex-row items-center space-x-4 pb-3 pt-5 px-5">
                         <Avatar className="h-12 w-12 border-2 border-primary/30">
                             <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                             <AvatarFallback>{testimonial.fallback}</AvatarFallback>
                         </Avatar>
                         <div>
                            <CardTitle className="text-md font-semibold text-foreground/90">{testimonial.name}</CardTitle>
                            <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />
                                ))}
                            </div>
                         </div>
                      </CardHeader>
                     <CardContent className="px-5 pb-5 pt-0">
                       <p className="text-sm text-foreground/80 leading-relaxed italic">"{testimonial.quote}"</p>
                     </CardContent>
                   </Card>
                 </motion.div>
               </CarouselItem>
             ))}
           </CarouselContent>
           <CarouselPrevious className="hidden sm:flex left-[-50px] text-primary hover:bg-primary/10 hover:text-primary" />
           <CarouselNext className="hidden sm:flex right-[-50px] text-primary hover:bg-primary/10 hover:text-primary" />
         </Carousel>

      </div>
    </section>
  );
}
