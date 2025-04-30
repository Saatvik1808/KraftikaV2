
"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about" }, // Added About Us
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();

  // Update scrolled state based on scroll position
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        // Apply glassmorphism effect, more opaque on scroll
        "glassmorphism border-b border-transparent",
        isScrolled
          ? "bg-[hsla(0,0%,100%,0.6)] dark:bg-[hsla(220,15%,15%,0.6)] border-[hsl(var(--border)/0.2)] shadow-sm"
          : "bg-[hsla(0,0%,100%,0.3)] dark:bg-[hsla(220,15%,15%,0.3)]"
      )}
      style={{ '--navbar-height': '4rem' } as React.CSSProperties} // Define navbar height for layout calculations
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2 group" aria-label="Kraftika Homepage">
           {/* Logo with hover animation */}
           <motion.div
            whileHover={{ scale: 1.1, filter: 'brightness(1.1)' }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
           >
            <Logo className="h-8 w-auto transition-all duration-300 group-hover:animate-glow text-primary" />
           </motion.div>
           <span className="font-semibold text-lg text-primary transition-colors group-hover:text-primary/80">Kraftika</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{
                 y: -2,
                 // Add text glow effect
                 textShadow: "0 0 8px hsla(var(--primary-hsl), 0.6)" // Use primary HSL with transparency
               }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative group"
            >
              <Link
                href={item.href}
                className="text-sm font-medium text-foreground/90 transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
               {/* Underline Ripple Animation */}
               <motion.span
                 layoutId={`underline-${item.name}`} // Unique layoutId per item
                 className="absolute left-0 -bottom-1 block h-[2px] w-full bg-primary origin-center"
                 initial={{ scaleX: 0 }}
                 whileHover={{ scaleX: 1, transition: { duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] } }} // Animate scaleX on hover
                 style={{ transformOrigin: 'center' }} // Ensure scaling from center
               />
                {/* Invisible span for exit animation area - prevents flicker when moving between link and underline */}
                <motion.span
                    className="absolute inset-x-0 -bottom-1 h-4" // Cover link and space below
                 />

            </motion.div>
          ))}
           {/* Optional Cart Icon */}
           <Button variant="ghost" size="icon" className="relative hover:bg-primary/10" aria-label="Shopping Cart">
             <ShoppingBag className="h-5 w-5 text-foreground/80 hover:text-primary" />
             {/* <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span> */}
           </Button>
        </div>


        {/* Mobile Navigation Trigger */}
        <div className="flex items-center md:hidden">
         <Button variant="ghost" size="icon" className="relative mr-2 hover:bg-primary/10" aria-label="Shopping Cart">
             <ShoppingBag className="h-5 w-5 text-foreground/80 hover:text-primary" />
         </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle Menu" className="hover:bg-primary/10">
                <Menu className="h-6 w-6 text-foreground/80 hover:text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6 glassmorphism border-l border-[hsl(var(--border)/0.2)]">
              <div className="mb-6 flex justify-between items-center">
                 <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                     <Logo className="h-7 w-auto text-primary" />
                     <span className="font-semibold text-md text-primary">Kraftika</span>
                 </Link>
                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close Menu" className="hover:bg-primary/10">
                     <X className="h-5 w-5 text-foreground/80 hover:text-primary" />
                 </Button>
              </div>

              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-base font-medium text-foreground transition-colors hover:text-primary py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
