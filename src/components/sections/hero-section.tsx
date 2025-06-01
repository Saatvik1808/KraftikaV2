
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// Removed CandleIcon and BackgroundParticles imports

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 12 },
    },
  };

  return (
    <section className="relative w-full overflow-hidden py-28 md:py-36 lg:py-48">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
        poster="/images/products/kraftika-bowl-candle.jpg" // Optional: a poster image while video loads
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Optional: Add a semi-transparent overlay if text readability is an issue over the video 
      <div className="absolute inset-0 w-full h-full bg-black/30 -z-5"></div> 
      */}

      <div className="container mx-auto max-w-7xl px-4 md:px-6 z-10 relative">
        <motion.div
          className="grid gap-10 md:grid-cols-2 md:items-center" // Keeping layout structure for content
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Placeholder for the left side, content now takes full width or adjusts as per text alignment */}
          <div className="md:col-span-1">
            {/* This div can be empty or you can adjust the grid if content is centered */}
          </div>

          {/* Text Content and CTA - ensuring it's on the right or centered depending on design preference */}
          <div className="space-y-6 text-center md:text-left md:col-span-1">
            <motion.h1
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight font-heading"
              variants={itemVariants}
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }} // Added text shadow for better readability over video
            >
               Where Scents{' '}
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent filter brightness-110">
                 Spark Joy
               </span>
            </motion.h1>
            <motion.p
              className="max-w-lg text-lg text-gray-200 md:text-xl mx-auto md:mx-0 leading-relaxed font-sans" // Adjusted text color for video
              variants={itemVariants}
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }} // Added text shadow
            >
              Indulge in handcrafted scented candles made with love, designed to brighten your space and soothe your soul.
            </motion.p>
            <motion.div
              className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center md:justify-start"
              variants={itemVariants}
              >
              <motion.div
                 whileHover={{ scale: 1.05, y: -2 }}
                 whileTap={{ scale: 0.95 }}
                 transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button asChild size="lg" className="btn-primary px-8 py-3 w-full sm:w-auto">
                  <Link href="/products">Shop Now</Link>
                </Button>
              </motion.div>
                <motion.div
                 whileHover={{ scale: 1.05, y: -2 }}
                 whileTap={{ scale: 0.95 }}
                 transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                 <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 w-full sm:w-auto border-white/70 text-white hover:bg-white/20 hover:text-white hover:border-white font-medium" // Adjusted button style for video
                 >
                    <Link href="/about">Explore Kraftika</Link>
                 </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
