
"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Leaf, Citrus, Flower2 } from 'lucide-react'; // Using Mint (Leaf), Orange (Citrus), Lavender (Flower2)

// Define particle types relevant to fruity/floral scents
const particleTypes = [
  { Icon: Citrus, color: 'hsl(var(--secondary-hsl))', sizeRange: [8, 15] }, // Peach/Orange
  { Icon: Leaf, color: 'hsl(var(--primary-hsl))', sizeRange: [10, 18] }, // Mint/Green Leaf
  { Icon: Flower2, color: 'hsl(var(--lilac-hsl))', sizeRange: [9, 16] }, // Lavender/Lilac
];

const numParticles = 25; // Reduced number for subtlety

interface ParticleData {
    id: number;
    Icon: React.ComponentType<any>; // Use React.ComponentType
    color: string;
    size: number;
    initialX: string;
    initialY: string;
    animationProps: {
        x: number[];
        y: number[];
        rotate: number[];
        opacity: number[];
        scale: number[];
        transition: {
            duration: number;
            repeat: number;
            repeatType: "loop" | "reverse" | "mirror" | undefined; // Correct type
            ease: string;
            delay: number;
        };
    };
}


export function BackgroundParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [isMounted, setIsMounted] = useState(false); // Track mount status

  // Generate particles only on the client side after mount
  useEffect(() => {
    setIsMounted(true); // Component has mounted on the client

    const generateParticles = () => {
      if (!containerRef.current) return []; // Guard against null ref

      const containerWidth = containerRef.current.offsetWidth || window.innerWidth;
      const containerHeight = containerRef.current.offsetHeight || window.innerHeight;

      return Array.from({ length: numParticles }).map((_, i): ParticleData => {
          const type = particleTypes[i % particleTypes.length];
          const size = Math.random() * (type.sizeRange[1] - type.sizeRange[0]) + type.sizeRange[0];
          // Generate random initial positions for animation start/end
          const startX = Math.random() * containerWidth;
          const startY = Math.random() * containerHeight;
          const endX = startX + (Math.random() - 0.5) * (containerWidth * 0.6); // Limit horizontal drift
          const endY = startY + (Math.random() - 0.5) * (containerHeight * 0.6); // Limit vertical drift

          return {
              id: i,
              Icon: type.Icon,
              color: type.color,
              size: size,
              // Deterministic initial style positions (e.g., center or corner)
              initialX: '50%',
              initialY: '50%',
              animationProps: {
                   // More dynamic movement - drift across screen slowly
                  x: [startX, endX],
                  y: [startY, endY],
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
              }
          };
      });
    };

    setParticles(generateParticles());

  }, []); // Run only once on mount

    // Start animation only after particles state is set and component is mounted
    useEffect(() => {
      if (isMounted && particles.length > 0 && containerRef.current) {
        controls.start(i => particles[i]?.animationProps || {});
      }
    }, [particles, controls, isMounted]); // Depend on particles state

  // Render only on the client after mount to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((particle) => (
         <motion.div
           key={particle.id}
           custom={particle.id}
           animate={controls}
           className="absolute"
           style={{
              // Use deterministic initial positions before animation starts
              left: particle.initialX,
              top: particle.initialY,
              opacity: 0, // Start invisible
              x: '-50%', // Center the particle initially if using percentage
              y: '-50%',
           }}
         >
           <particle.Icon style={{ color: particle.color }} width={particle.size} height={particle.size} strokeWidth={1.2} />
         </motion.div>
      ))}
    </div>
  );
}
