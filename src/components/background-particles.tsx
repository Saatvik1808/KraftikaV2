"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Citrus, Leaf, Flower } from 'lucide-react'; // Using lucide icons as placeholders

// Define particle types and their properties
const particleTypes = [
  { Icon: Citrus, color: 'hsl(var(--accent))', sizeRange: [8, 16] },
  { Icon: Leaf, color: 'hsl(var(--secondary))', sizeRange: [10, 18] },
  { Icon: Flower, color: 'hsl(var(--primary))', sizeRange: [12, 20] },
];

const numParticles = 30; // Number of particles

export function BackgroundParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    controls.start(i => ({
      x: Math.random() * (containerRef.current?.offsetWidth || window.innerWidth),
      y: Math.random() * (containerRef.current?.offsetHeight || window.innerHeight),
      opacity: [0, Math.random() * 0.4 + 0.1, 0], // Fade in and out
      scale: [0, Math.random() * 0.5 + 0.5, 0], // Scale animation
      transition: {
        duration: Math.random() * 15 + 10, // Longer, varied duration
        repeat: Infinity,
        repeatType: 'loop',
        ease: "linear",
        delay: Math.random() * 5, // Random delay
      },
    }));
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
           left: `${Math.random() * 100}%`, // Initial random position
           top: `${Math.random() * 100}%`,
           opacity: 0, // Start invisible
        }}
      >
        <type.Icon style={{ color: type.color }} width={size} height={size} strokeWidth={1.5} />
      </motion.div>
    );
  });

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles}
    </div>
  );
}
