
"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ShoppingBag, Heart, User, LogOut, Download, ChevronDown, LayoutDashboard } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/logo";
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { useCartCount } from "@/hooks/use-cart-count";
import { IOSInstallInstructions } from "@/components/ios-install-instructions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Main navigation items (always visible)
const mainNavItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
];

// Shop dropdown items
const shopItems = [
  { name: "Candle Care", href: "/candle-care" },
  { name: "FAQ", href: "/faq" },
];

// About dropdown items
const aboutItems = [
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
];

// Contact (always visible)
const contactItem = { name: "Contact", href: "/contact" };

// Synchronous check for iOS (runs immediately, no hook delay)
const checkIOSSync = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Synchronous check if already installed
const checkInstalledSync = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches;
};

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { isInstallable, install, deviceType, isIOS, isMobile, showIOSInstructions, dismissIOSInstructions } = usePWAInstall();
  const cartCount = useCartCount();
  
  // Calculate install button visibility synchronously (no state delay)
  const showInstallButton = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    if (checkInstalledSync()) return false;
    // Show immediately for iOS (synchronous check)
    // For Android/Chrome, use hook state (will update via effect)
    return checkIOSSync() || isInstallable;
  }, [isInstallable]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
    key={pathname}
    className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 rounded-none border-b backdrop-blur-xl",
      isScrolled
        ? "bg-[hsl(40_60%_98%/0.82)] dark:bg-[hsl(24_22%_10%/0.82)] border-[hsl(var(--border)/0.6)] shadow-[0_8px_28px_-12px_hsla(30,60%,40%,0.18)]"
        : "bg-[hsl(40_60%_98%/0.92)] dark:bg-[hsl(24_22%_10%/0.92)] border-transparent"
    )}
    
    style={{ '--navbar-height': '4rem' } as React.CSSProperties}
  >
      {/* Candle-flame accent line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2.5px]"
        style={{ background: "linear-gradient(90deg, transparent, hsl(44 95% 60%) 18%, hsl(32 95% 55%) 50%, hsl(14 85% 58%) 82%, transparent)" }}
      />
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2 group" aria-label="Kraftika Homepage">
          <motion.div
            whileHover={{ rotate: [0, 5, -5, 0], scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Logo 
              width={67} 
              height={10} 
              className="text-primary-foreground transition-colors duration-300 group-hover:text-primary group-hover:animate-glow" 
            />
          </motion.div>
          <span className="font-heading font-bold text-xl tracking-wide text-primary-foreground transition-colors duration-300 group-hover:text-primary">
            KRAFTIKA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-1 md:flex">
          {/* Main Nav Items */}
          {mainNavItems.map((item) => (
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
                    ? "text-foreground font-semibold" 
                    : "text-foreground/65 hover:text-foreground"
                )}
              >
                {item.name}
                <motion.span
                  className="absolute left-3 right-3 -bottom-0.5 block h-[2px] origin-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                  initial={{ scaleX: 0 }}
                  variants={{
                    hover: { scaleX: 1 },
                    rest: { scaleX: pathname === item.href ? 1 : 0 }
                  }}
                  transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                />
              </Link>
            </motion.div>
          ))}

          {/* Shop Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover="hover"
                animate={shopItems.some(item => pathname === item.href) ? "hover" : "rest"}
                variants={{
                  hover: { y: -2 },
                  rest: { y: 0 }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={cn(
                  "relative group font-sans text-sm font-medium transition-colors relative z-10 px-3 py-2 flex items-center gap-1",
                  "[&[data-state=open]_svg]:rotate-180",
                  shopItems.some(item => pathname === item.href)
                    ? "text-foreground font-semibold" 
                    : "text-foreground/65 hover:text-foreground"
                )}
              >
                Shop
                <ChevronDown className="h-3 w-3 transition-transform duration-200" />
                <motion.span
                  className="absolute left-3 right-3 -bottom-0.5 block h-[2px] origin-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                  initial={{ scaleX: 0 }}
                  variants={{
                    hover: { scaleX: 1 },
                    rest: { scaleX: shopItems.some(item => pathname === item.href) ? 1 : 0 }
                  }}
                  transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {shopItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "cursor-pointer",
                      pathname === item.href && "bg-accent"
                    )}
                  >
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* About Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover="hover"
                animate={aboutItems.some(item => pathname === item.href) ? "hover" : "rest"}
                variants={{
                  hover: { y: -2 },
                  rest: { y: 0 }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={cn(
                  "relative group font-sans text-sm font-medium transition-colors relative z-10 px-3 py-2 flex items-center gap-1",
                  "[&[data-state=open]_svg]:rotate-180",
                  aboutItems.some(item => pathname === item.href)
                    ? "text-foreground font-semibold" 
                    : "text-foreground/65 hover:text-foreground"
                )}
              >
                About
                <ChevronDown className="h-3 w-3 transition-transform duration-200" />
                <motion.span
                  className="absolute left-3 right-3 -bottom-0.5 block h-[2px] origin-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                  initial={{ scaleX: 0 }}
                  variants={{
                    hover: { scaleX: 1 },
                    rest: { scaleX: aboutItems.some(item => pathname === item.href) ? 1 : 0 }
                  }}
                  transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {aboutItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "cursor-pointer",
                      pathname === item.href && "bg-accent"
                    )}
                  >
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Contact Link */}
          <motion.div
            whileHover="hover"
            animate={pathname === contactItem.href ? "hover" : "rest"}
            variants={{
              hover: { y: -2 },
              rest: { y: 0 }
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative group"
          >
            <Link
              href={contactItem.href}
              className={cn(
                "font-sans text-sm font-medium transition-colors relative z-10 px-3 py-2",
                pathname === contactItem.href 
                  ? "text-foreground font-semibold" 
                  : "text-foreground/65 hover:text-foreground"
              )}
            >
              {contactItem.name}
              <motion.span
                className="absolute left-3 right-3 -bottom-0.5 block h-[2px] origin-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                initial={{ scaleX: 0 }}
                variants={{
                  hover: { scaleX: 1 },
                  rest: { scaleX: pathname === contactItem.href ? 1 : 0 }
                }}
                transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
              />
            </Link>
          </motion.div>
          
          {/* Wishlist Icon Link */}
          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50 transition-colors group/icon" aria-label="View Wishlist">
            <Link href="/wishlist">
              <Heart className="h-5 w-5 text-foreground/60 transition-colors group-hover/icon:text-rose-500" />
            </Link>
          </Button>
          
          {/* Cart Icon Link */}
          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50 transition-colors group/icon relative" aria-label="Shopping Cart">
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-5 w-5 text-foreground/60 transition-colors group-hover/icon:text-amber-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 px-1 text-[10px] font-bold leading-none text-white shadow-[0_0_8px_rgba(251,146,60,0.6)]">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Install App Button - Rendered immediately for iOS, updated for Android/Chrome */}
          {showInstallButton && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={install}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={isIOS ? "Add to Home Screen" : "Install App"}
            >
              <Download className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="hidden lg:inline text-sm font-medium text-gray-600 dark:text-gray-400">
                {isIOS ? "Add to Home" : "Install App"}
              </span>
            </Button>
          )}

          {/* User Menu */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50 transition-colors group/icon">
                  <User className="h-5 w-5 text-foreground/60 transition-colors group-hover/icon:text-amber-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.firstName || user.email || user.phone}</p>
                    <p className="text-xs text-muted-foreground">{user.email || user.phone}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              size="sm"
              className="rounded-full px-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:from-amber-600 hover:to-orange-600 hover:shadow-[0_0_18px_-2px_rgba(251,146,60,0.6)] transition-all"
            >
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center md:hidden">
          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50 transition-colors group/icon" aria-label="View Wishlist">
            <Link href="/wishlist">
              <Heart className="h-5 w-5 text-foreground/60 transition-colors group-hover/icon:text-rose-500" />
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50 transition-colors group/icon relative" aria-label="Shopping Cart">
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-5 w-5 text-foreground/60 transition-colors group-hover/icon:text-amber-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 px-1 text-[10px] font-bold leading-none text-white shadow-[0_0_8px_rgba(251,146,60,0.6)]">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50 transition-colors group/icon">
                  <User className="h-5 w-5 text-foreground/60 transition-colors group-hover/icon:text-amber-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.firstName || user.email || user.phone}</p>
                    <p className="text-xs text-muted-foreground">{user.email || user.phone}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-secondary/50 transition-colors group/icon">
              <Link href="/login">
                <User className="h-5 w-5 text-foreground/60 transition-colors group-hover/icon:text-amber-600" />
              </Link>
            </Button>
          )}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle Menu" className="rounded-full hover:bg-secondary/50 transition-colors">
                <Menu className="h-6 w-6 text-foreground/70" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 bg-[hsl(40_60%_98%)] dark:bg-[hsl(24_22%_10%)]">
              <SheetHeader className="p-6 pb-4 border-b border-border">
                  <SheetTitle>
                    <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                      <Logo width={120} height={30} className="text-primary-foreground" />
                    </Link>
                  </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col p-6 space-y-1">
                {/* Main Nav Items */}
                {mainNavItems.map((item) => (
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

                {/* Shop Section */}
                <div className="pt-2 pb-1">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
                    Shop
                  </p>
                  {shopItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "font-sans text-base font-medium transition-colors py-2 px-4 -mx-2 rounded-md block",
                        pathname === item.href 
                          ? "text-gray-900 dark:text-gray-100 font-semibold bg-gray-100 dark:bg-gray-800" 
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* About Section */}
                <div className="pt-2 pb-1">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
                    About
                  </p>
                  {aboutItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "font-sans text-base font-medium transition-colors py-2 px-4 -mx-2 rounded-md block",
                        pathname === item.href 
                          ? "text-gray-900 dark:text-gray-100 font-semibold bg-gray-100 dark:bg-gray-800" 
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Contact */}
                <Link
                  href={contactItem.href}
                  className={cn(
                    "font-sans text-base font-medium transition-colors py-3 px-2 -mx-2 rounded-md",
                    pathname === contactItem.href 
                      ? "text-gray-900 dark:text-gray-100 font-semibold bg-gray-100 dark:bg-gray-800" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {contactItem.name}
                </Link>
                
                {/* Install App Button in Mobile Menu */}
                {showInstallButton && (
                  <button
                    onClick={async () => {
                      await install();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "font-sans text-base font-medium transition-colors py-3 px-2 -mx-2 rounded-md",
                      "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                      "flex items-center gap-2"
                    )}
                  >
                    <Download className="h-4 w-4" />
                    {isIOS ? "Add to Home Screen" : "Install App"}
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* iOS Install Instructions Dialog */}
      <IOSInstallInstructions 
        open={showIOSInstructions} 
        onClose={dismissIOSInstructions} 
      />
    </motion.nav>
  );
}
