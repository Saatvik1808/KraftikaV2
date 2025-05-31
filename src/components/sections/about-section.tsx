
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image'; // Import Image for owner picture
import { Leaf, Droplet, Gift, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import Avatar

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

// Keep features concise
const features = [
  {
    icon: Leaf,
    title: 'Natural Soy Wax', // Specify Soy
    description: 'Clean-burning, eco-friendly soy wax for a mindful experience.',
    color: 'text-primary',
  },
  {
    icon: Sparkles, // Changed icon
    title: 'Hand-Poured in India', // Highlight origin
    description: 'Lovingly crafted by hand in small batches for unique quality.',
     color: 'text-accent-foreground', // Changed from text-accent to text-accent-foreground
  },
  {
    icon: Droplet, // Keep Droplet for scent
    title: 'Premium Fragrances',
    description: 'Infused with fine essential oils for authentic, cozy aromas.',
     color: 'text-secondary',
  },
];

export function AboutSection() {
  return (
    // Using Lavender Gradient as requested - soft, warm, artisanal feel
    <section className="w-full py-16 md:py-24 bg-gradient-lavender overflow-hidden">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Title */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
            {/* Elegant Serif Heading (Forum) */}
            <h2 className="text-3xl font-bold font-heading tracking-tight text-foreground sm:text-4xl">
              Crafted with Heart & Soul
            </h2>
            {/* Body Font (Lato) */}
            <p className="mt-3 text-lg font-sans text-muted-foreground/90 md:mt-4 max-w-3xl mx-auto">
              Discover the passion behind every Kraftika candle.
            </p>
          </motion.div>

          {/* Our Story & Vision - Rewritten & Compact */}
          <motion.div variants={itemVariants} className="mb-16 text-center max-w-3xl mx-auto">
             {/* Elegant Serif Heading */}
             <h3 className="text-2xl font-semibold font-heading text-foreground/90 mb-4">Our Philosophy</h3>
              {/* Body Font (Lato) - Compelling Description */}
             <p className="text-muted-foreground/80 leading-relaxed font-sans">
                Welcome to Kraftika, where mindful living meets aromatic bliss. Born from a passion for craftsmanship in India, each candle is lovingly hand-poured using eco-friendly soy wax and premium fragrances. We believe in creating cozy moments and sparking joy through sustainable, beautifully scented candles that soothe the soul.
             </p>
          </motion.div>

           {/* Meet the Maker Section */}
          <motion.div variants={itemVariants} className="mb-16">
              <h3 className="text-2xl font-semibold font-heading text-foreground/90 mb-8 text-center">Meet the Maker</h3>
              <motion.div
                 className="max-w-md mx-auto glassmorphism p-6 md:p-8 border border-[hsl(var(--border)/0.2)] shadow-lg flex flex-col sm:flex-row items-center gap-6"
                 whileHover={{ y: -5, boxShadow: '0 10px 25px -8px hsla(var(--lilac-hsl), 0.3)' }} // Subtle hover effect
                 transition={{ type: "spring", stiffness: 300 }}
              >
                   <Avatar className="h-24 w-24 border-2 border-primary/30 shadow-sm">
                       <AvatarImage src="https://picsum.photos/seed/owner/200" alt="Anamika Sinha" data-ai-hint="person portrait founder" />
                       <AvatarFallback>AS</AvatarFallback>
                   </Avatar>
                   <div className="text-center sm:text-left">
                       <h4 className="text-xl font-medium font-heading text-foreground mb-1">Anamika Sinha</h4>
                       <p className="text-sm font-semibold text-primary mb-2">Founder & Candlemaker</p>
                       <p className="text-sm text-muted-foreground/90 font-sans leading-snug">
                           "I started Kraftika to share the simple joy a beautiful scent can bring. It's about creating moments of peace and warmth, sustainably and with love."
                       </p>
                   </div>
              </motion.div>
          </motion.div>

          {/* What Makes Us Special */}
          <motion.div variants={itemVariants} className="mb-12 text-center">
               <h3 className="text-2xl font-semibold font-heading text-foreground/90 mb-8">Why Choose Kraftika?</h3>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8" // Use 3 columns for features
                 variants={containerVariants}
               >
                 {features.map((feature, index) => (
                  <motion.div
                     key={index}
                     variants={itemVariants}
                      whileHover="hover"
                   >
                     <Card className="h-full text-center glassmorphism border border-[hsl(var(--border)/0.15)] shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
                       <CardHeader className="items-center pb-4">
                          <motion.div variants={cardHoverVariants} >
                              <feature.icon className={`h-10 w-10 mb-3 ${feature.color}`} strokeWidth={1.5} />
                          </motion.div>
                         <CardTitle className="text-lg font-semibold font-heading text-foreground/90">{feature.title}</CardTitle>
                       </CardHeader>
                       <CardContent>
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
