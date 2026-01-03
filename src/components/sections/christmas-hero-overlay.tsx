"use client";

import { motion } from "framer-motion";
import { Sparkles, Gift } from "lucide-react";

export function ChristmasHeroOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-5">
      {/* Floating Christmas elements */}
      <motion.div
        className="absolute top-20 left-10 md:left-20"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        {/* Santa Hat */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-80"
        >
          <path
            d="M30 10L15 25H20L30 15L40 25H45L30 10Z"
            fill="white"
            opacity="0.9"
          />
          <path
            d="M30 15L20 25H40L30 15Z"
            fill="#DC2626"
          />
          <circle cx="42" cy="25" r="3" fill="white" />
          <path
            d="M30 25L25 30H35L30 25Z"
            fill="#DC2626"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-32 right-10 md:right-20"
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          delay: 0.5,
        }}
      >
        {/* Gift Box */}
        <div className="relative">
          <Gift className="h-16 w-16 text-white/90" />
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
          >
            <Sparkles className="h-8 w-8 text-yellow-300" />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-1/4"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          delay: 1,
        }}
      >
        {/* Snowflake */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white/70"
        >
          <path
            d="M20 5V35M5 20H35M28.5 11.5L11.5 28.5M28.5 28.5L11.5 11.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="20" cy="20" r="3" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Reindeer silhouette (simple) */}
      <motion.div
        className="absolute bottom-20 right-1/4 hidden md:block"
        animate={{
          x: [0, 5, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          delay: 1.5,
        }}
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white/60"
        >
          {/* Simple reindeer head */}
          <ellipse cx="25" cy="20" rx="15" ry="12" fill="currentColor" opacity="0.7" />
          <ellipse cx="15" cy="18" rx="3" ry="4" fill="currentColor" />
          <ellipse cx="35" cy="18" rx="3" ry="4" fill="currentColor" />
          <path
            d="M25 28L30 35L25 32L20 35Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
    </div>
  );
}





