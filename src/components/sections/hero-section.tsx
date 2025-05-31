
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
        // More varied and pronounced horizontal float based on index for scattering
        x: [0, (i % 2 === 0 ? 1 : -1) * (8 + i * 2), (i % 2 === 0 ? -1.5 : 1.5) * (6 + i * 1.5), 0, (i % 2 === 0 ? 0.5 : -0.5) * (10 + i)],
        rotate: [0, 1.5, -1.5, 0, 1.5], // Reduced rotation
      transition: {
        duration: 7 + i * 1.8, // Slightly more varied duration
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay: i * 0.35, // Stagger float start
      },
    }),
  };

  const themeColorClasses = ['text-primary', 'text-accent', 'text-secondary', 'text-muted', 'text-lilac'];
  const themeColorHslVars = ['primary-hsl', 'accent-hsl', 'secondary-hsl', 'muted-hsl', 'lilac-hsl'];

  // Adjusted positions for 4 candles to be more scattered
  const topPositions = ['20%', '65%', '45%', '30%'];
  const leftPositions = ['15%', '80%', '60%', '35%'];


  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/30 via-primary/10 to-background py-28 md:py-36 lg:py-48">
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
            {/* Updated to 4 candles */}
            {[0, 1, 2, 3].map((i) => {
              const colorIndex = i % themeColorClasses.length;
              const colorClass = themeColorClasses[colorIndex];
              const colorHslVar = themeColorHslVars[colorIndex];
              const currentZIndex = 4 - (i % 2); // Simpler zIndex for 4 candles (e.g., 4, 3, 4, 3)
              const topPosition = topPositions[i]; 
              const leftPosition = leftPositions[i];

              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: leftPosition,
                    top: topPosition,
                    transform: 'translate(-50%, -50%)',
                    zIndex: currentZIndex,
                  }}
                  variants={candleVariants}
                  initial="initial"
                  animate={["animate", "float"]} 
                  custom={i}
                >
                  <CandleIcon
                    className={`h-28 w-28 lg:h-36 lg:w-36 opacity-90 filter drop-shadow-lg ${colorClass}`}
                    style={{ filter: `drop-shadow(0 5px 15px hsla(var(--${colorHslVar}), 0.25))` }}
                   />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Text Content and CTA */}
          <div className="space-y-6 text-center md:text-left">
            <motion.h1
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight font-heading"
              variants={itemVariants}
            >
               Where Scents{' '}
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent filter brightness-90">
                 Spark Joy
               </span>
            </motion.h1>
            <motion.p
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
                 <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 w-full sm:w-auto border-primary/70 text-primary-foreground hover:bg-primary/10 hover:text-primary-foreground/80 hover:border-primary font-medium"
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
