import type { SVGProps } from "react";

// Modern, Simple & Stylized Candle Icon
export function CandleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor" // Changed fill to currentColor
        stroke="currentColor"
        strokeWidth="1" // Slightly thinner stroke for body
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {/* Flame (more organic shape) - Using current color with opacity adjustment */}
        <path
            d="M12 6C10.8 7.5 10 9.5 10 11.5c0 1.66 1.12 3 2 3s2-1.34 2-3c0-2-0.8-4-2-5.5Z"
            fillOpacity="0.8" // Adjust opacity for flame
            stroke="currentColor"
            strokeOpacity="0.5" // Softer stroke for flame
            strokeWidth="0.8"
        />
        {/* Wick */}
        <path d="M12 14.5V16" stroke="hsl(var(--foreground))" strokeOpacity="0.7" strokeWidth="1"/>

        {/* Candle Body (simple, slightly rounded rectangle) - Uses currentColor for fill */}
        <rect
            x="7"
            y="16"
            width="10"
            height="6"
            rx="2" // More rounded
            // Fill will be handled by className text color
            stroke="currentColor" // Stroke also uses className color, slightly opaque
            strokeOpacity="0.3"
            fillOpacity="0.9" // Slightly adjust body fill opacity
        />
    </svg>
  );
}
