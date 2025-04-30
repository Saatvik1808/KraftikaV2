"use client";

import { LazyMotion, domAnimation } from "framer-motion";

export function Providers({ children }: { children: React.ReactNode }) {
  // Wrap the app in LazyMotion to enable code splitting for Framer Motion features.
  // domAnimation includes only the features needed for DOM animations.
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
