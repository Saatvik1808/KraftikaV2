
"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ShoppingBag, Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { usePathname } from 'next/navigation';

const navItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "FAQ", href: "/faq"}
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
    className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      "glassmorphism border-b border-transparent",
      isScrolled
        ? "bg-[hsla(0,0%,100%,0.7)] dark:bg-[hsla(220,15%,15%,0.7)] border-[hsl(var(--border)/0.2)] shadow-sm"
        : "bg-white/90 dark:bg-gray-950/90"
    )}
    
    style={{ '--navbar-height': '4rem' } as React.CSSProperties}
  >
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2 group" aria-label="Kraftika Homepage">
          <motion.div
            whileHover={{ rotate: [0, 5, -5, 0], scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Logo 
              width={120} 
              height={30} 
              className="text-primary-foreground transition-colors duration-300 group-hover:text-primary group-hover:animate-glow" 
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-1 md:flex">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover="hover"
              animate={pathname === item.href ? "hover" : "rest"}
              variants={{
                hover: { y: -2 },
                rest: { y: 0 }
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative group"
            >
              <Link
                href={item.href}
                className={cn(
                  "font-sans text-sm font-medium transition-colors relative z-10 px-3 py-2",
                  pathname === item.href 
                    ? "text-gray-900 dark:text-gray-100 font-semibold" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                {item.name}
                <motion.span
                  className="absolute left-3 right-3 -bottom-0.5 block h-[2px] bg-primary origin-center"
                  initial={{ scaleX: 0 }}
                  variants={{
                    hover: { scaleX: 1 },
                    rest: { scaleX: pathname === item.href ? 1 : 0 }
                  }}
                  transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                  style={{ transformOrigin: 'center' }}
                />
              </Link>
            </motion.div>
          ))}
          
          {/* Wishlist Icon Link */}
          <Button asChild variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="View Wishlist">
            <Link href="/wishlist">
              <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-primary" />
            </Link>
          </Button>
          
          {/* Cart Icon Link */}
          <Button asChild variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Shopping Cart">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-primary" />
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center md:hidden">
          <Button asChild variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="View Wishlist">
            <Link href="/wishlist">
              <Heart className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-primary" />
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Shopping Cart">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-primary" />
            </Link>
          </Button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle Menu" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 bg-white dark:bg-gray-950">
              <SheetHeader className="p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <SheetTitle>
                    <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                      <Logo width={120} height={30} className="text-primary-foreground" />
                    </Link>
                  </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col p-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "font-sans text-base font-medium transition-colors py-3 px-2 -mx-2 rounded-md",
                      pathname === item.href 
                        ? "text-gray-900 dark:text-gray-100 font-semibold bg-gray-100 dark:bg-gray-800" 
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    )}
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
