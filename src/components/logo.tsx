import type { SVGProps } from "react";

// Modern stylized flame/leaf icon for Kraftika
export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5" // Slightly thinner stroke
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
       <defs>
         {/* Define multiple gradients for depth/playfulness */}
         <linearGradient id="kraftikaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.9 }} /> {/* Pastel Green */}
           <stop offset="60%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.8 }} /> {/* Lemon Yellow */}
           <stop offset="100%" style={{ stopColor: 'hsl(var(--secondary))', stopOpacity: 0.7 }} /> {/* Soft Peach */}
         </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
       </defs>
      {/* Smoother, more organic flame/leaf shape */}
       <path
          d="M12 2C9.25 4.5 7 7.5 7 11c0 3.31 2.69 6 5 6s5-2.69 5-6c0-3.5-2.25-6.5-5-9z"
          fill="url(#kraftikaGradient)"
          stroke="hsl(var(--primary-foreground))" // Use a darker shade for stroke
          strokeOpacity="0.4"
        />
        {/* Inner highlight or detail */}
        <path
           d="M12 6c-1.5 1.5-2.5 3.5-2.5 5.5 0 1.66 1.12 3 2.5 3s2.5-1.34 2.5-3c0-2-1-4-2.5-5.5z"
           fill="white"
           fillOpacity="0.3"
           stroke="none"
         />
        {/* Optional subtle glow effect applied via CSS/Framer Motion */}
        {/* <path d="M12 2C9.25 4.5 7 7.5 7 11c0 3.31 2.69 6 5 6s5-2.69 5-6c0-3.5-2.25-6.5-5-9z" fill="transparent" stroke="hsl(var(--primary))" strokeWidth="3" filter="url(#glow)" opacity="0.5"/> */}
    </svg>
  );
}
