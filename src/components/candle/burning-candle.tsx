"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Animated burning candle.
 * - CSS-keyframe flame flicker (cheap, GPU-only transforms)
 * - Breathing glow halo + rising smoke wisp + embers
 * - `meltOnScroll`: the candle slowly burns down (wax shrinks, flame follows)
 *   as the page scrolls — driven by framer-motion useScroll.
 */
export function BurningCandle({
  className = "",
  meltOnScroll = false,
  size = 280,
}: {
  className?: string;
  meltOnScroll?: boolean;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll(
    meltOnScroll ? { target: ref, offset: ["start start", "end start"] } : undefined,
  );

  // Wax burns down to ~62% height over the scroll range; flame rides on top.
  const waxScale = useTransform(scrollYProgress, [0, 1], [1, 0.62]);
  const flameY = useTransform(scrollYProgress, [0, 1], [0, 0.38 * size * 0.52]);
  const still = prefersReducedMotion || !meltOnScroll;

  const w = size;
  const h = size * 1.25;

  return (
    <div ref={ref} className={`relative select-none pointer-events-none ${className}`} style={{ width: w, height: h }} aria-hidden>
      {/* Halo */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full animate-flame-glow"
        style={{
          top: h * 0.02,
          width: w * 0.7,
          height: w * 0.7,
          background:
            "radial-gradient(circle, hsla(var(--glow-hsl),0.5) 0%, hsla(var(--flame-hsl),0.22) 40%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />

      {/* Embers */}
      {!prefersReducedMotion &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute rounded-full animate-ember-rise"
            style={{
              left: `${46 + i * 5}%`,
              top: h * 0.16,
              width: 4 - i,
              height: 4 - i,
              background: "hsl(var(--ember-hsl))",
              boxShadow: "0 0 6px 1px hsla(var(--ember-hsl),0.8)",
              animationDelay: `${i * 1.1}s`,
              ["--ember-drift" as string]: `${(i - 1) * 18}px`,
            }}
          />
        ))}

      {/* Smoke wisp */}
      {!prefersReducedMotion && (
        <span
          className="absolute left-1/2 -translate-x-1/2 rounded-full animate-smoke-rise"
          style={{
            top: h * 0.1,
            width: 10,
            height: 26,
            background:
              "radial-gradient(ellipse, hsla(30,20%,80%,0.5), transparent 70%)",
            filter: "blur(3px)",
            animationDelay: "2s",
          }}
        />
      )}

      {/* Flame — rides down as the candle melts. Top offset puts the wick tip
          exactly on the wax rim (wax top = h*0.38). */}
      <motion.div
        className="absolute left-1/2 z-10"
        style={{ top: h * 0.105, x: "-50%", y: still ? 0 : flameY }}
      >
        <div
          className="animate-flame-flicker origin-bottom"
          style={{ width: w * 0.16, height: w * 0.30 }}
        >
          {/* Outer flame */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, hsl(18 95% 52%), hsl(32 100% 58%) 45%, hsl(44 100% 68%) 75%, hsl(50 100% 82%))",
              borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
              boxShadow:
                "0 0 24px 6px hsla(var(--glow-hsl),0.55), 0 0 60px 18px hsla(var(--flame-hsl),0.28)",
            }}
          />
          {/* Inner core */}
          <div
            className="absolute animate-flame-core origin-bottom"
            style={{
              left: "28%",
              bottom: "8%",
              width: "44%",
              height: "52%",
              background:
                "linear-gradient(to top, hsl(210 80% 70% / 0.9), hsl(48 100% 90%) 60%, hsl(52 100% 96%))",
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              filter: "blur(0.5px)",
            }}
          />
        </div>
        {/* Wick */}
        <div
          className="mx-auto"
          style={{
            width: 3,
            height: w * 0.045,
            background: "linear-gradient(to top, #2a1c12, #4a3324 70%, #111)",
            borderRadius: 2,
          }}
        />
      </motion.div>

      {/* Wax body — shrinks as you scroll */}
      <motion.div
        className="absolute left-1/2 bottom-0 origin-bottom"
        style={{ x: "-50%", scaleY: still ? 1 : waxScale, width: w * 0.46, height: h * 0.62 }}
      >
        <div
          className="w-full h-full relative overflow-visible"
          style={{
            background:
              "linear-gradient(105deg, hsl(38 45% 96%) 0%, hsl(36 50% 90%) 40%, hsl(33 40% 82%) 85%, hsl(30 35% 76%))",
            borderRadius: "10px 10px 14px 14px",
            boxShadow:
              "inset -10px 0 24px -12px hsla(28,30%,40%,0.35), inset 10px 0 24px -14px hsla(45,80%,90%,0.8), 0 18px 30px -16px hsla(28,40%,20%,0.45)",
          }}
        >
          {/* Melted rim */}
          <div
            className="absolute -top-2 left-0 right-0 h-5"
            style={{
              background:
                "linear-gradient(180deg, hsl(42 60% 97%), hsl(38 50% 92%))",
              borderRadius: "50% 50% 40% 40% / 90% 90% 30% 30%",
              boxShadow: "inset 0 -3px 8px hsla(36,60%,70%,0.6)",
            }}
          />
          {/* Wax drips */}
          <div
            className="absolute -top-1 left-[12%] w-[10%] animate-wax-drip origin-top"
            style={{
              height: "26%",
              background: "linear-gradient(180deg, hsl(40 55% 95%), hsl(36 45% 88%))",
              borderRadius: "0 0 50% 50% / 0 0 90% 90%",
            }}
          />
          <div
            className="absolute -top-1 right-[16%] w-[8%] animate-wax-drip origin-top"
            style={{
              height: "16%",
              background: "linear-gradient(180deg, hsl(40 55% 95%), hsl(36 45% 88%))",
              borderRadius: "0 0 50% 50% / 0 0 90% 90%",
              animationDelay: "2.5s",
            }}
          />
          {/* Warm light cast on the wax from the flame */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[36%] animate-glow-breathe"
            style={{
              background:
                "radial-gradient(ellipse at top, hsla(var(--glow-hsl),0.4), transparent 70%)",
            }}
          />
        </div>
      </motion.div>

      {/* Ground glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[50%] animate-glow-breathe"
        style={{
          width: w * 0.9,
          height: h * 0.07,
          background:
            "radial-gradient(ellipse, hsla(var(--flame-hsl),0.25), transparent 70%)",
          filter: "blur(4px)",
        }}
      />
    </div>
  );
}
