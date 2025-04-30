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
    title: 'Eco-Friendly Wax',
    description: 'Sustainable soy & coconut wax blends for a clean, beautiful burn.',
    color: 'text-primary', // Pastel Green
  },
  {
    icon: Droplet,
    title: 'Premium Essential Oils',
    description: 'Infused with natural essential oils for authentic, delightful aromas.',
     color: 'text-accent', // Lemon Yellow
  },
  {
    icon: Gift,
    title: 'Hand-Poured with Care',
    description: 'Each candle is lovingly hand-poured in small batches for quality.',
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Story & Passion
            </h2>
            <p className="mt-3 text-lg text-muted-foreground/90 md:mt-4 max-w-3xl mx-auto">
              Crafting moments of joy, one scent at a time.
            </p>
          </motion.div>

          {/* Our Story & Vision */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-16 items-center">
             <div className="space-y-4">
                 <h3 className="text-2xl font-semibold text-foreground/90">Handmade Craftsmanship</h3>
                 <p className="text-muted-foreground/80 leading-relaxed">
                   At Kraftika, we believe in the simple magic of a beautifully scented candle. Each one is meticulously handcrafted with passion, using sustainable materials and the finest fragrances. We pour our hearts into creating scents that evoke memories, inspire calm, and bring a little spark of joy into your home.
                 </p>
             </div>
             <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground/90">Vision for Joyful Living</h3>
                <p className="text-muted-foreground/80 leading-relaxed">
                 Our mission is to enhance your everyday life through the power of scent. We envision homes filled with warmth, tranquility, and delightful aromas that celebrate sustainable practices and promote mindful moments. We strive to be your trusted source for candles that don't just smell good, but feel good too.
                 </p>
             </div>
          </motion.div>

          {/* What Makes Us Special */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
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
                     <Card className="h-full text-center glassmorphism border border-[hsl(var(--border)/0.15)] shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                       <CardHeader className="items-center pb-4">
                          <motion.div variants={cardHoverVariants} >
                              <feature.icon className={`h-10 w-10 mb-3 ${feature.color}`} strokeWidth={1.5} />
                          </motion.div>
                         <CardTitle className="text-lg font-semibold text-foreground/90">{feature.title}</CardTitle>
                       </CardHeader>
                       <CardContent>
                         <p className="text-sm text-muted-foreground/80">{feature.description}</p>
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
