"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";

export function ValentineHeroOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-5">
      {/* Floating Heart elements */}
      <motion.div
        className="absolute top-20 left-10 md:left-20"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        style={{ willChange: 'transform' }}
      >
        {/* Large Heart */}
        <Heart className="h-16 w-16 text-pink-300/80 fill-pink-300/60" />
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          style={{ willChange: 'transform, opacity' }}
        >
          <Sparkles className="h-10 w-10 text-pink-200" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-32 right-10 md:right-20"
        animate={{
          y: [0, 12, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 0.5,
        }}
        style={{ willChange: 'transform' }}
      >
        {/* Rose/Heart Cluster */}
        <div className="relative">
          <Heart className="h-14 w-14 text-rose-400/90 fill-rose-400/70" />
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
            style={{ willChange: 'transform, opacity' }}
          >
            <Heart className="h-8 w-8 text-pink-300/80 fill-pink-300/60" />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            style={{ willChange: 'transform, opacity' }}
          >
            <Sparkles className="h-8 w-8 text-pink-200" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/4"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          delay: 1,
        }}
        style={{ willChange: 'transform' }}
      >
        {/* Floating Heart */}
        <Heart className="h-12 w-12 text-white/60 fill-white/40" />
        <motion.div
          className="absolute -bottom-1 -left-1"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          style={{ willChange: 'transform' }}
        >
          <Sparkles className="h-6 w-6 text-pink-200/70" />
        </motion.div>
      </motion.div>

      {/* Cupid Arrow (simplified) */}
      <motion.div
        className="absolute bottom-20 right-1/4 hidden md:block"
        animate={{
          x: [0, 8, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          delay: 1.5,
        }}
        style={{ willChange: 'transform' }}
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white/60"
        >
          {/* Heart with arrow */}
          <path
            d="M25 10C25 10 15 5 10 12C5 19 10 28 25 38C40 28 45 19 40 12C35 5 25 10 25 10Z"
            fill="currentColor"
            opacity="0.7"
          />
          <path
            d="M30 20L40 10M40 10L35 5M40 10L35 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>
      </motion.div>

      {/* Additional floating hearts */}
      <motion.div
        className="absolute top-1/2 left-1/3"
        animate={{
          y: [0, -8, 0],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 0.8,
        }}
        style={{ willChange: 'transform, opacity' }}
      >
        <Heart className="h-8 w-8 text-pink-300/50 fill-pink-300/30" />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/3"
        animate={{
          y: [0, 10, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1.2,
        }}
        style={{ willChange: 'transform, opacity' }}
      >
        <Heart className="h-6 w-6 text-rose-300/50 fill-rose-300/30" />
      </motion.div>
    </div>
  );
}

