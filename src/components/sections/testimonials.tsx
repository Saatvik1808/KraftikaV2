"use client";

import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"; // Assuming carousel exists


// Sample Testimonial Data
const testimonials = [
  { name: "Alice L.", quote: "Kraftika candles smell absolutely divine! The Sunrise Citrus brightens my whole morning.", avatar: "https://picsum.photos/seed/avatar1/100", rating: 5 },
  { name: "Ben C.", quote: "The Lavender Dreams candle is so calming. Perfect for winding down after a long day.", avatar: "https://picsum.photos/seed/avatar2/100", rating: 5 },
  { name: "Chloe D.", quote: "Beautiful packaging and even better scents. Vanilla Bean Bliss is my favorite!", avatar: "https://picsum.photos/seed/avatar3/100", rating: 4 },
   { name: "David F.", quote: "High-quality candles with unique scents. The Mint Mojito is incredibly refreshing.", avatar: "https://picsum.photos/seed/avatar4/100", rating: 5 },
];

export function Testimonials() {
  return (
    <section className="w-full py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-3 text-lg text-muted-foreground md:mt-4">
            Hear from candle lovers who adore Kraftika.
          </p>
        </div>

         <Carousel
           opts={{
             align: "start",
             loop: true,
           }}
           className="w-full max-w-xs sm:max-w-xl lg:max-w-4xl mx-auto"
         >
           <CarouselContent>
             {testimonials.map((testimonial, index) => (
               <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                 <div className="p-1 h-full">
                   <Card className="h-full flex flex-col justify-between glassmorphism overflow-hidden">
                      <CardHeader className="flex flex-row items-center space-x-4 pb-4">
                         <Avatar>
                             <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                             <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div>
                            <CardTitle className="text-base font-semibold">{testimonial.name}</CardTitle>
                            <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'text-accent fill-accent' : 'text-muted-foreground/50'}`} />
                                ))}
                            </div>
                         </div>
                      </CardHeader>
                     <CardContent>
                       <p className="text-sm text-foreground/90 leading-relaxed">"{testimonial.quote}"</p>
                     </CardContent>
                   </Card>
                 </div>
               </CarouselItem>
             ))}
           </CarouselContent>
           <CarouselPrevious className="hidden sm:flex" />
           <CarouselNext className="hidden sm:flex" />
         </Carousel>

      </div>
    </section>
  );
}
