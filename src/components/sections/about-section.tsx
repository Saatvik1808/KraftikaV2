'use client';

import { motion } from 'framer-motion';
import { Leaf, Droplet, Gift } from 'lucide-react'; // Example icons
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const cardHoverVariants = {
   rest: { y: 0 },
   hover: { y: -6, transition: { type: "spring", stiffness: 300, damping: 10 } }
}

const features = [
  {
    icon: Leaf,
    title: 'Natural Waxes', // Renamed for clarity
    description: 'Sustainable soy & coconut wax for a clean, beautiful burn.', // Shortened
    color: 'text-primary', // Pastel Green
  },
  {
    icon: Droplet,
    title: 'Premium Fragrances', // Renamed
    description: 'Infused with fine essential oils for authentic aromas.', // Shortened
     color: 'text-accent', // Lemon Yellow
  },
  {
    icon: Gift,
    title: 'Hand-Poured Artistry', // Renamed
    description: 'Lovingly hand-poured in small batches for ultimate quality.', // Shortened
     color: 'text-secondary', // Soft Peach
  },
];

export function AboutSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-lavender overflow-hidden"> {/* Lavender Gradient */}
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Title */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
             {/* Use font-heading implicitly via h2 styling in globals.css */}
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Story & Passion
            </h2>
             {/* Use font-sans implicitly via p styling in globals.css */}
            <p className="mt-3 text-lg text-muted-foreground/90 md:mt-4 max-w-3xl mx-auto">
              Crafting moments of joy, one scent at a time.
            </p>
          </motion.div>

          {/* Our Story & Vision */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-16 items-center">
             <div className="space-y-4">
                  {/* Use font-heading implicitly via h3 styling in globals.css */}
                 <h3 className="text-2xl font-semibold text-foreground/90">Handmade Craftsmanship</h3>
                  {/* Use font-sans implicitly via p styling in globals.css */}
                 <p className="text-muted-foreground/80 leading-relaxed font-sans">
                    At Kraftika, every candle is a testament to handcrafted passion. We meticulously pour sustainable natural wax blends, infusing them with the finest fragrances to create moments of pure aromatic delight.
                 </p>
             </div>
             <div className="space-y-4">
                 {/* Use font-heading implicitly via h3 styling in globals.css */}
                <h3 className="text-2xl font-semibold text-foreground/90">Vision for Joyful Living</h3>
                 {/* Use font-sans implicitly via p styling in globals.css */}
                <p className="text-muted-foreground/80 leading-relaxed font-sans">
                  Our vision is simple: to elevate your everyday through the transformative power of scent. We craft sustainable, beautiful candles that inspire tranquility, warmth, and mindful moments in your home.
                 </p>
             </div>
          </motion.div>

          {/* What Makes Us Special */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
               {/* Use font-heading implicitly via h3 styling in globals.css */}
              <h3 className="text-2xl font-semibold text-foreground/90 mb-8">What Makes Kraftika Special?</h3>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                 variants={containerVariants} // Reuse container for card stagger
               >
                 {features.map((feature, index) => (
                  <motion.div
                     key={index}
                     variants={itemVariants} // Stagger card entrance
                      whileHover="hover" // Apply hover animation from cardHoverVariants
                   >
                      {/* Glassmorphism applied via class */}
                     <Card className="h-full text-center glassmorphism border border-[hsl(var(--border)/0.15)] shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                       <CardHeader className="items-center pb-4">
                          <motion.div variants={cardHoverVariants} >
                              <feature.icon className={`h-10 w-10 mb-3 ${feature.color}`} strokeWidth={1.5} />
                          </motion.div>
                           {/* Card Title uses default Card styles */}
                         <CardTitle className="text-lg font-semibold text-foreground/90">{feature.title}</CardTitle>
                       </CardHeader>
                       <CardContent>
                          {/* Card content uses default Card styles (muted foreground) */}
                         <p className="text-sm text-muted-foreground/80 font-sans">{feature.description}</p>
                       </CardContent>
                     </Card>
                   </motion.div>
                 ))}
               </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
