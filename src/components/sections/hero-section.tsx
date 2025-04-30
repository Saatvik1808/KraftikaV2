"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CandleIcon } from "@/components/icons/candle-icon"; // Placeholder for candle icon/SVG
import { BackgroundParticles } from "@/components/background-particles"; // Import background particles

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const candleVariants = {
    float: (i: number) => ({
      y: [0, -10, 0, 10, 0],
      x: [0, 5, -5, 0, 5],
      rotate: [0, 2, -2, 0, 2],
      transition: {
        duration: 5 + i * 1.5, // Vary duration for each candle
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay: i * 0.5, // Stagger start times
      },
    }),
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background via-muted/50 to-secondary/20 py-24 md:py-32 lg:py-40">
       {/* Background Particles */}
      <BackgroundParticles />

      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          className="grid gap-12 md:grid-cols-2 md:items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Floating Candles */}
          <motion.div
            className="relative hidden h-64 w-full justify-center md:flex md:h-96"
            aria-hidden="true"
          >
            {/* Stacked SVG/3D Style Candles */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  // Adjust positioning for stacking effect
                  left: `${30 + i * 15}%`,
                  top: `${20 + (i % 2 === 0 ? 0 : 15)}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3 - i, // Higher index candles appear on top
                }}
                variants={candleVariants}
                animate="float"
                custom={i} // Pass index to custom prop
              >
                <CandleIcon
                  className={`h-32 w-32 lg:h-40 lg:w-40 text-primary/70 opacity-80 filter drop-shadow-lg ${i === 1 ? 'text-accent/70' : ''} ${i === 2 ? 'text-secondary/70' : ''}`}
                  style={{ filter: `drop-shadow(0 5px 15px hsla(var(--${i === 0 ? 'primary' : i === 1 ? 'accent' : 'secondary'}-hsl), 0.3))` }}
                 />
              </motion.div>
            ))}
          </motion.div>

          {/* Text Content and CTA */}
          <div className="relative z-10 space-y-6 text-center md:text-left">
            <motion.h1
              className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary"
              variants={itemVariants}
            >
              Light Up Your Life
            </motion.h1>
            <motion.p
              className="max-w-md text-lg text-muted-foreground md:text-xl mx-auto md:mx-0"
              variants={itemVariants}
            >
              Discover handcrafted scented candles that transform your space and elevate your mood.
            </motion.p>
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                 className="inline-block"
              >
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/40 transition-shadow duration-300 px-8 py-3">
                  <Link href="/products">Explore Scents</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
