import type { SVGProps } from "react";

// Placeholder Candle Icon (Simple Flame on a Base)
export function CandleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5" // Thinner stroke for elegance
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {/* Candle Base - slightly rounded rectangle */}
        <path d="M16 4h.01" /> {/* Wick top part */}
        <path d="M16 8a4 4 0 1 0-8 0c0 2 4 7.9 4 7.9s4-5.9 4-7.9Z" fill="hsl(var(--accent-hsl))" stroke="hsl(var(--accent-hsl))" /> {/* Flame */}
         <path d="M8 18h8" /> {/* Wick bottom part */}
        <rect x="6" y="18" width="12" height="4" rx="1" fill="currentColor" stroke="currentColor" /> {/* Candle body */}
    </svg>
  );
}
