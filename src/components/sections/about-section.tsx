'use client';

import Image from 'next/image'; // <-- add this import
import { motion } from 'framer-motion';
import { Leaf, Droplet, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const features = [
  {
    icon: Leaf,
    title: 'Natural Soy Wax',
    description: 'Clean-burning, eco-friendly soy wax for a mindful experience.',
    color: 'text-emerald-500',
  },
  {
    icon: Sparkles,
    title: 'Hand-Poured in India',
    description: 'Lovingly crafted by hand in small batches for unique quality.',
    color: 'text-amber-500',
  },
  {
    icon: Droplet,
    title: 'Premium Fragrances',
    description: 'Infused with fine essential oils for authentic, cozy aromas.',
    color: 'text-violet-500',
  },
];

export function AboutSection() {
  return (
    <section className="w-full py-24 bg-gradient-to-b from-[#faf8ff] to-[#f4f0ff]">
      <div className="container mx-auto max-w-6xl px-5">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Section Title */}
          <motion.div 
            variants={itemVariants} 
            className="mb-20 text-center"
          >
            <h2 className="mb-10 text-center text-4xl font-bold tracking-tight sm:text-5xl
             text-transparent bg-clip-text bg-gradient-to-r
             from-primary via-secondary to-accent
             filter brightness-75">
              Crafted with <span >Heart & Soul</span>
            </h2>
            <div className="mx-auto mt-6 h-px w-16 bg-gray-300" />
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover the passion behind every Kraftika candle
            </p>
          </motion.div>

          {/* Our Philosophy */}
          <motion.div 
            variants={itemVariants} 
            className="mb-24 max-w-4xl mx-auto text-center"
          >
            <h3 className="text-2xl font-normal text-gray-700 mb-8">
              Our Philosophy
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg font-light">
              Welcome to Kraftika, where mindful living meets aromatic bliss. Born from a passion for craftsmanship in India, each candle is lovingly hand-poured using eco-friendly soy wax and premium fragrances. We believe in creating cozy moments and sparking joy through sustainable, beautifully scented candles that soothe the soul.
            </p>
          </motion.div>

          {/* Meet the Maker */}
          <motion.div 
            variants={itemVariants} 
            className="mb-24"
          >
            <h3 className="text-2xl font-normal text-gray-700 mb-12 text-center">
              Meet the Maker
            </h3>
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden">
                <Image
                  src="/anamika.jpeg" 
                  alt="Anamika Sinha" 
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              <div className="text-center">
                <h4 className="text-xl font-normal text-gray-800 mb-1">Anamika Sinha</h4>
                <p className="text-sm text-gray-500 mb-4 tracking-wider">FOUNDER & CANDLEMAKER</p>
                <p className="text-gray-600 leading-relaxed italic font-light">
                  "I started Kraftika to share the simple joy a beautiful scent can bring. It's about creating moments of peace and warmth, sustainably and with love."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div 
            variants={itemVariants} 
            className="text-center"
          >
            <h3 className="text-2xl font-normal text-gray-700 mb-12">
              Why Choose Kraftika?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full text-center bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-8">
                    <CardHeader className="items-center pb-6">
                      <div className={`p-3 mb-4 ${feature.color}`}>
                        <feature.icon className="h-8 w-8" strokeWidth={1.5} />
                      </div>
                      <CardTitle className="text-lg font-normal text-gray-800">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 font-light leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
