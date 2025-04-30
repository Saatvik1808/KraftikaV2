"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react"; // Added ShoppingBag for cart icon

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo"; // Assuming Logo component exists

const navItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Contact", href: "/contact" },
  // { name: "About", href: "/about" }, // Optional
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrollY.get() > 50
          ? "bg-[hsla(0,0%,100%,0.6)] dark:bg-[hsla(240,10%,10%,0.5)] backdrop-blur-lg border-b border-[hsl(var(--border)/0.5)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2" aria-label="Kraftika Homepage">
           <Logo className="h-8 w-auto" /> {/* Use Logo component */}
           <span className="font-semibold text-lg text-primary">Kraftika</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 md:flex">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative group"
            >
              <Link
                href={item.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary group-hover:text-primary"
              >
                {item.name}
              </Link>
               <motion.span
                 layoutId="underline"
                 className="absolute left-0 -bottom-1 block h-[2px] w-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"
               />
            </motion.div>
          ))}
           {/* Optional Cart Icon */}
           <Button variant="ghost" size="icon" className="relative" aria-label="Shopping Cart">
             <ShoppingBag className="h-5 w-5" />
             {/* Add a badge for item count if needed */}
             {/* <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span> */}
           </Button>
        </div>


        {/* Mobile Navigation Trigger */}
        <div className="flex items-center md:hidden">
         <Button variant="ghost" size="icon" className="relative mr-2" aria-label="Shopping Cart">
             <ShoppingBag className="h-5 w-5" />
         </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6 glassmorphism">
              <div className="mb-6 flex justify-between items-center">
                 <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                     <Logo className="h-7 w-auto" />
                     <span className="font-semibold text-md text-primary">Kraftika</span>
                 </Link>
                 <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close Menu">
                     <X className="h-5 w-5" />
                 </Button>
              </div>

              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-base font-medium text-foreground transition-colors hover:text-primary"
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
