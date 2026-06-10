"use client";

/**
 * Melting-wax section divider — a dripping SVG edge between sections.
 * `flip` points the drips upward; `fill` should match the NEXT section's bg.
 */
export function WaxDivider({
  fill = "hsl(var(--background))",
  flip = false,
  className = "",
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden leading-none -mb-px ${className}`}
      style={flip ? { transform: "rotate(180deg)" } : undefined}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block w-full h-[48px] md:h-[72px]"
      >
        <path
          fill={fill}
          d="M0,0 L1440,0 L1440,38
             C1392,38 1380,74 1344,74 C1308,74 1302,44 1260,44
             C1218,44 1212,66 1176,66 C1140,66 1128,30 1080,30
             C1032,30 1026,58 984,58 C942,58 936,40 894,40
             C852,40 840,82 798,82 C756,82 750,48 708,48
             C666,48 660,62 618,62 C576,62 564,26 516,26
             C468,26 462,54 420,54 C378,54 372,36 330,36
             C288,36 276,70 234,70 C192,70 186,44 144,44
             C102,44 96,60 60,60 C24,60 12,38 0,38 Z"
        />
      </svg>
    </div>
  );
}
