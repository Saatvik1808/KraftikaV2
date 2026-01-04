"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, ArrowRight } from "lucide-react";

export function ValentineBanner() {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 overflow-hidden"
    >
      {/* Animated hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/20"
            initial={{
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : i * 60,
              y: -20,
              opacity: 0,
              rotate: Math.random() * 360,
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800,
              opacity: [0, 0.6, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Heart className="h-5 w-5 fill-current" />
          </motion.div>
        ))}
      </div>

      {/* Sparkle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkles className="h-4 w-4 text-pink-200" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-3 md:py-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
          {/* Heart Icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="text-white"
          >
            <Heart className="h-8 w-8 fill-white" />
          </motion.div>

          {/* Main Message */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Heart className="h-5 w-5 text-pink-200 inline-block mr-2 fill-pink-200" />
            </motion.div>
            <span className="text-white font-semibold text-sm md:text-base">
              <span className="font-bold">Valentine's Special!</span> Perfect Gift Candles for Your Loved Ones -{" "}
              <span className="text-pink-200 font-bold">Order Online Now</span>
            </span>
          </div>

          {/* CTA Button */}
          <Link href="/products">
            <Button
              size="sm"
              className="bg-white text-rose-600 hover:bg-pink-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              Order Online <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

