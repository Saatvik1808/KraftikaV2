"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  className, 
  size = "md",
  text 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        {/* Outer rotating ring */}
        <div
          className={cn(
            "rounded-full border-4 border-transparent",
            sizeClasses[size],
            "border-t-[#caa494] border-r-[#b8d4a8]",
            "animate-spin"
          )}
          style={{
            background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #caa494, #b8d4a8) border-box",
            border: "4px solid transparent",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        >
          <div 
            className={cn(
              "absolute inset-0 rounded-full",
              "bg-gradient-to-br from-[#caa494]/20 to-[#b8d4a8]/20",
              "animate-pulse"
            )}
          />
        </div>
        
        {/* Inner dot */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "rounded-full bg-gradient-to-r from-[#caa494] to-[#b8d4a8]",
            size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-3 w-3",
            "animate-pulse"
          )}
        />
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Spinner variant (simpler, faster)
export const Spinner: React.FC<Omit<LoaderProps, "text">> = ({ 
  className, 
  size = "md"
}) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-[3px]",
    lg: "h-8 w-8 border-4",
  };

  return (
    <div
      className={cn(
        "rounded-full border-t-transparent border-r-transparent",
        "border-b-[#caa494] border-l-[#b8d4a8]",
        sizeClasses[size],
        "animate-spin",
        className
      )}
      style={{
        borderStyle: "solid",
        borderTopColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#caa494",
        borderLeftColor: "#b8d4a8",
      }}
    />
  );
};

// Full page loader
export const PageLoader: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader size="lg" text={text} />
    </div>
  );
};

// Inline loader (for buttons, small spaces)
export const InlineLoader: React.FC<{ className?: string }> = ({ className }) => {
  return <Spinner size="sm" className={className} />;
};

export default Loader;

