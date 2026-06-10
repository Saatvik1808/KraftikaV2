"use client";

import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Field of softly rising embers/sparks for hero backgrounds.
 * Pure CSS animations — no per-frame JS.
 */
export function EmberField({ count = 14, className = "" }: { count?: number; className?: string }) {
  const prefersReducedMotion = useReducedMotion();

  // Deterministic pseudo-random layout so SSR/CSR match.
  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const rand = (n: number) => ((seed * (n + 1)) % 997) / 997;
        return {
          left: 5 + rand(1) * 90,
          bottom: rand(2) * 35,
          size: 2 + rand(3) * 3,
          delay: rand(4) * 6,
          duration: 4 + rand(5) * 5,
          drift: (rand(6) - 0.5) * 60,
          warm: rand(7) > 0.5,
        };
      }),
    [count],
  );

  if (prefersReducedMotion) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-ember-rise"
          style={{
            left: `${e.left}%`,
            bottom: `${e.bottom}%`,
            width: e.size,
            height: e.size,
            background: e.warm ? "hsl(var(--glow-hsl))" : "hsl(var(--ember-hsl))",
            boxShadow: `0 0 ${e.size * 2.5}px 1px hsla(var(--glow-hsl),0.7)`,
            animationDelay: `${e.delay}s`,
            animationDuration: `${e.duration}s`,
            ["--ember-drift" as string]: `${e.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
