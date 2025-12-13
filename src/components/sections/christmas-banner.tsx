"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Gift, Snowflake } from "lucide-react";

export function ChristmasBanner() {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative w-full bg-gradient-to-r from-red-600 via-red-500 to-pink-500 overflow-hidden"
    >
      {/* Animated snowflakes background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/30"
            initial={{
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : i * 50,
              y: -20,
              opacity: 0,
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Snowflake className="h-4 w-4" />
          </motion.div>
        ))}
      </div>

      {/* Sparkle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
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
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkles className="h-3 w-3 text-yellow-300" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-3 md:py-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
          {/* Santa Hat Icon */}
          <motion.div
            animate={{
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-white"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block"
            >
              {/* Santa Hat */}
              <path
                d="M16 4L6 14H10L16 8L22 14H26L16 4Z"
                fill="white"
              />
              <path
                d="M16 8L8 16H24L16 8Z"
                fill="#DC2626"
              />
              <circle cx="22" cy="14" r="2" fill="white" />
            </svg>
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
              <Gift className="h-5 w-5 text-yellow-300 inline-block mr-2" />
            </motion.div>
            <span className="text-white font-semibold text-sm md:text-base">
              🎄 <span className="font-bold">Christmas Special!</span> Perfect Gift Candles -{" "}
              <span className="text-yellow-300 font-bold">Free Shipping</span> on orders above ₹500
            </span>
          </div>

          {/* CTA Button */}
          <Link href="/products">
            <Button
              size="sm"
              className="bg-white text-red-600 hover:bg-yellow-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Shop Now 🎁
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

