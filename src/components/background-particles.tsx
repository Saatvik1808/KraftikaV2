"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Leaf, Citrus, Flower2 } from 'lucide-react'; // Using Mint (Leaf), Orange (Citrus), Lavender (Flower2)

// Define particle types relevant to fruity/floral scents
const particleTypes = [
  { Icon: Citrus, color: 'hsl(var(--secondary-hsl))', sizeRange: [8, 15] }, // Peach/Orange
  { Icon: Leaf, color: 'hsl(var(--primary-hsl))', sizeRange: [10, 18] }, // Mint/Green Leaf
  { Icon: Flower2, color: 'hsl(var(--lilac-hsl))', sizeRange: [9, 16] }, // Lavender/Lilac
];

const numParticles = 25; // Reduced number for subtlety

export function BackgroundParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const animateParticles = () => {
        controls.start(i => ({
          // More dynamic movement - drift across screen slowly
          x: [Math.random() * (containerRef.current?.offsetWidth || window.innerWidth) - 50, Math.random() * (containerRef.current?.offsetWidth || window.innerWidth) + 50],
          y: [Math.random() * (containerRef.current?.offsetHeight || window.innerHeight) - 50, Math.random() * (containerRef.current?.offsetHeight || window.innerHeight) + 50],
          rotate: [0, Math.random() * 180 - 90], // Gentle rotation
          opacity: [0, Math.random() * 0.3 + 0.05, 0], // Very subtle fade
          scale: [0.5, Math.random() * 0.4 + 0.6, 0.5], // Subtle scale pulse
          transition: {
            duration: Math.random() * 25 + 15, // Slower, more varied duration
            repeat: Infinity,
            repeatType: 'loop',
            ease: "linear",
            delay: Math.random() * 10, // Random start delay
          },
        }));
    }
    animateParticles();

    // Optional: Re-trigger animation on window resize
    // window.addEventListener('resize', animateParticles);
    // return () => window.removeEventListener('resize', animateParticles);

  }, [controls]);


  const particles = Array.from({ length: numParticles }).map((_, i) => {
    const type = particleTypes[i % particleTypes.length];
    const size = Math.random() * (type.sizeRange[1] - type.sizeRange[0]) + type.sizeRange[0];

    return (
      <motion.div
        key={i}
        custom={i}
        animate={controls}
        className="absolute"
        style={{
           // Start particles off-screen or near edges for smoother entrance
           left: `${Math.random() > 0.5 ? Math.random() * 20 - 10 : Math.random() * 20 + 90}%`,
           top: `${Math.random() > 0.5 ? Math.random() * 20 - 10 : Math.random() * 20 + 90}%`,
           opacity: 0, // Start invisible
        }}
      >
        <type.Icon style={{ color: type.color }} width={size} height={size} strokeWidth={1.2} />
      </motion.div>
    );
  });

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles}
    </div>
  );
}
