import type { SVGProps } from "react";

// Modern, Simple & Stylized Candle Icon
export function CandleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <defs>
            {/* Gradient for the flame */}
            <linearGradient id="candleFlameGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--accent-hsl))', stopOpacity: 1 }} /> {/* Yellowish top */}
                <stop offset="100%" style={{ stopColor: 'hsl(var(--secondary-hsl))', stopOpacity: 0.8 }} /> {/* Peach bottom */}
            </linearGradient>
             {/* Gradient for the candle body */}
             <linearGradient id="candleBodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--primary-hsl), 0.8)', stopOpacity: 1 }} /> {/* Lighter Primary top */}
                <stop offset="100%" style={{ stopColor: 'hsl(var(--primary-hsl), 1)', stopOpacity: 1 }} /> {/* Primary bottom */}
            </linearGradient>
        </defs>

        {/* Flame (more organic shape) */}
        <path
            d="M12 6C10.8 7.5 10 9.5 10 11.5c0 1.66 1.12 3 2 3s2-1.34 2-3c0-2-0.8-4-2-5.5Z"
            fill="url(#candleFlameGradient)"
            stroke="hsl(var(--accent-hsl))"
            strokeWidth="1"
            strokeOpacity="0.6"
        />
        {/* Wick */}
        <path d="M12 14.5V16" stroke="hsl(var(--foreground))" strokeOpacity="0.7" strokeWidth="1"/>

        {/* Candle Body (simple, slightly rounded rectangle) */}
        <rect
            x="7"
            y="16"
            width="10"
            height="6"
            rx="2" // More rounded
            fill="url(#candleBodyGradient)"
            stroke="hsl(var(--primary-foreground))"
            strokeOpacity="0.3"
            strokeWidth="1"
        />
    </svg>
  );
}
