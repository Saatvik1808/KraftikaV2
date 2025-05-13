import Image from 'next/image';
import type { ImageProps } from 'next/image';
import type { HTMLAttributes } from 'react';

// Props now extend basic HTML attributes for the wrapping div,
// and allow passing standard ImageProps like priority.
// We remove SVG specific props.
interface LogoProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  // Allow passing next/image specific props if needed, like priority
  priority?: ImageProps['priority'];
  width?: number;
  height?: number;
}

// Use the provided PNG image as the logo
export function Logo({ className, priority, width = 32, height = 32, ...props }: LogoProps) {
  return (
    // The className is applied to the wrapping div or directly to Image if no wrapper is needed
    <Image
      src="/kraftika-logo.png" // Path relative to the 'public' directory
      alt="Kraftika Logo"
      width={width} // Default width, can be overridden by className if using Tailwind size classes
      height={height} // Default height
      priority={priority} // Pass priority prop if provided
      className={className} // Apply Tailwind classes passed via props
      {...props} // Pass any remaining div props (like aria-label if needed)
    />
  );
}
