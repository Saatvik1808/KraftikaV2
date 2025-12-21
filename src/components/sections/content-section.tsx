'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, Leaf, Heart } from 'lucide-react';

export function ContentSection() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Discover the Art of Scented Candles
            </h2>
            <p className="text-lg text-muted-foreground">
              Learn how to transform your home with premium handcrafted candles
            </p>
          </div>

          <div className="space-y-8 text-base leading-relaxed text-muted-foreground">
            <p>
              Welcome to Kraftika, India's premier destination for handcrafted scented candles. In a world filled with mass-produced items, we believe in the power of artisanal craftsmanship and sustainable living. Each candle we create is a testament to our commitment to quality, sustainability, and the simple joy that a beautiful scent can bring to your home.
            </p>

            <p>
              Our journey began with a simple mission: to create candles that are not only beautiful and fragrant, but also safe for your health and gentle on the planet. We use only natural soy wax, which burns cleaner and longer than traditional paraffin candles. Combined with phthalate-free fragrances and carefully selected essential oils, our candles create an atmosphere of warmth and tranquility while contributing to your well-being through the benefits of aromatherapy.
            </p>

            <p>
              What sets Kraftika apart is our dedication to the craft of candle making. Unlike mass-produced alternatives, each of our candles is hand-poured in small batches, ensuring quality and consistency. This artisanal approach allows us to create unique scent combinations and maintain the highest standards throughout the production process. Every candle receives individual attention, from the selection of ingredients to the final quality check.
            </p>

            <p>
              Beyond creating beautiful products, we're committed to sustainable practices. Our soy wax comes from renewable sources, our packaging is designed to minimize environmental impact, and we continuously seek ways to reduce our carbon footprint. When you choose Kraftika, you're supporting a brand that values the planet as much as it values creating moments of joy and relaxation.
            </p>

            <p>
              Our candles are designed to enhance every moment—whether you're creating a cozy atmosphere for a quiet evening at home, preparing for a special occasion, or simply seeking a moment of peace in a busy day. From energizing citrus scents that brighten your mornings to calming lavender blends that prepare you for restful sleep, we have fragrances for every mood and occasion.
            </p>

            <p>
              We invite you to explore our collection and discover how Kraftika candles can transform your living spaces. Join thousands of satisfied customers who have made our handcrafted candles a part of their daily routines. Experience the difference that quality, care, and natural ingredients make, and let Kraftika help you create those perfect moments of aromatic bliss in your home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <Leaf className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">100% Natural</h3>
              <p className="text-sm text-muted-foreground">
                Made with sustainable soy wax and natural fragrances
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <Heart className="h-8 w-8 mx-auto mb-4 text-secondary" />
              <h3 className="font-semibold mb-2">Handcrafted</h3>
              <p className="text-sm text-muted-foreground">
                Each candle is lovingly hand-poured in small batches
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <BookOpen className="h-8 w-8 mx-auto mb-4 text-accent" />
              <h3 className="font-semibold mb-2">Learn More</h3>
              <p className="text-sm text-muted-foreground">
                Explore our blog for candle care tips and guides
              </p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/blog">
                Explore Our Blog
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

