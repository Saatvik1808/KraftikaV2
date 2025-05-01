
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CandleIcon } from "@/components/icons/candle-icon"; // Updated Candle Icon
import { BackgroundParticles } from "@/components/background-particles"; // Re-import background particles

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Slightly faster stagger
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 12 }, // Softer spring
    },
  };

  const candleVariants = {
    initial: { opacity: 0, scale: 0.5, y: 50 },
    animate: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.2 + i * 0.15, // Stagger entrance
        type: "spring",
        stiffness: 100,
        damping: 15,
      }
    }),
    float: (i: number) => ({
        y: [0, -8, 0, 8, 0], // Reduced float range
        x: [0, 4, -4, 0, 4],
        rotate: [0, 1.5, -1.5, 0, 1.5], // Reduced rotation
      transition: {
        duration: 6 + i * 1.5, // Slightly faster base duration
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay: i * 0.3, // Stagger float start
      },
    }),
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/30 via-primary/10 to-background py-28 md:py-36 lg:py-48">
       {/* Background Particles - Ensure they use appropriate fruity icons */}
      <BackgroundParticles />

      <div className="container mx-auto max-w-7xl px-4 md:px-6 z-10 relative">
        <motion.div
          className="grid gap-10 md:grid-cols-2 md:items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Floating Candles Visual */}
          <motion.div
            className="relative flex h-64 w-full justify-center items-center md:h-96"
            aria-hidden="true"
          >
            {/* Staggered SVG Candles */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  // Adjust positioning for a pleasing staggered arrangement
                  left: `${25 + i * 25}%`,
                  top: `${20 + (i % 2 === 0 ? 5 : 20)}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3 - i,
                }}
                variants={candleVariants}
                initial="initial"
                animate={["animate", "float"]} // Combine entrance and float animations
                custom={i}
              >
                <CandleIcon
                  className={`h-28 w-28 lg:h-36 lg:w-36 opacity-90 filter drop-shadow-lg
                    ${i === 0 ? 'text-primary' : i === 1 ? 'text-accent' : 'text-secondary'}`} // Use theme colors
                  style={{ filter: `drop-shadow(0 5px 15px hsla(var(--${i === 0 ? 'primary' : i === 1 ? 'accent' : 'secondary'}-hsl), 0.25))` }}
                 />
              </motion.div>
            ))}
          </motion.div>

          {/* Text Content and CTA */}
          <div className="space-y-6 text-center md:text-left">
            <motion.h1
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight font-heading" // Explicitly use heading font if needed
              variants={itemVariants}
            >
               Where Scents{' '}
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent filter brightness-90">
                 Spark Joy
               </span>
            </motion.h1>
            <motion.p
              // Adjusted: Removed font-light, changed color to foreground/80
              className="max-w-lg text-lg text-foreground/80 md:text-xl mx-auto md:mx-0 leading-relaxed font-sans"
              variants={itemVariants}
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
                 <Button asChild size="lg" variant="outline" className="px-8 py-3 w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                    <Link href="/about">Explore Kraftika</Link>
                 </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
       {/* Optional: Add a subtle curved divider at the bottom */}
       {/* <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent section-divider"></div> */}
    </section>
  );
}
