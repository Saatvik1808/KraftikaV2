
 "use client";

 import * as React from "react";
 import Link from "next/link";
 import { motion, useScroll, useMotionValueEvent } from "framer-motion";
 import { Menu, X, ShoppingBag, Heart } from "lucide-react";

 import { cn } from "@/lib/utils";
 import { Button } from "@/components/ui/button";
 import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
 import { Logo } from "@/components/logo"; // Import Logo
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
           ? "bg-[hsla(0,0%,100%,0.6)] dark:bg-[hsla(220,15%,15%,0.6)] border-[hsl(var(--border)/0.2)] shadow-sm"
           : "bg-[hsla(0,0%,100%,0.3)] dark:bg-[hsla(220,15%,15%,0.3)]"
       )}
       style={{ '--navbar-height': '4rem' } as React.CSSProperties}
     >
       <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
         <Link href="/" className="flex items-center space-x-2 group" aria-label="Kraftika Homepage">
            <motion.div
             whileHover={{ rotate: [0, 8, -8, 0], scale: 1.1 }}
             transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
            <Logo 
              width={60} 
              height={16} 
              className="text-primary-foreground transition-colors duration-300 group-hover:text-primary group-hover:animate-glow" 
            />
            </motion.div>
            <span className="font-heading font-bold text-xl tracking-wide text-primary-foreground transition-colors duration-300 group-hover:text-primary">
                KRAFTIKA
            </span>
         </Link>

         {/* Desktop Navigation */}
         <div className="hidden items-center space-x-6 md:flex">
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
                     "font-sans text-sm font-medium transition-colors relative z-10",
                      pathname === item.href ? "text-primary font-semibold" : "text-foreground hover:text-foreground"
                  )}
                  style={pathname === item.href ? { textShadow: "0 0 8px hsla(var(--primary-hsl), 0.6)" } : {}}
                >
                  {item.name}
                  <motion.span
                    className="absolute left-0 -bottom-1 block h-[2px] w-full bg-primary origin-center"
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
            <Button asChild variant="ghost" size="icon" className="relative hover:bg-primary/10" aria-label="View Wishlist">
              <Link href="/wishlist">
                <Heart className="h-5 w-5 text-foreground/80 hover:text-primary" />
              </Link>
            </Button>
            {/* Cart Icon Link */}
            <Button asChild variant="ghost" size="icon" className="relative hover:bg-primary/10" aria-label="Shopping Cart">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5 text-foreground/80 hover:text-primary" />
              </Link>
            </Button>
         </div>


         {/* Mobile Navigation Trigger */}
         <div className="flex items-center md:hidden">
          <Button asChild variant="ghost" size="icon" className="relative mr-1 hover:bg-primary/10" aria-label="View Wishlist">
            <Link href="/wishlist">
              <Heart className="h-5 w-5 text-foreground/80 hover:text-primary" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative mr-1 hover:bg-primary/10" aria-label="Shopping Cart">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5 text-foreground/80 hover:text-primary" />
            </Link>
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
                      <Logo width={60} height={14} className="text-primary-foreground" />
                      <span className="font-heading font-bold text-lg tracking-wide text-primary-foreground">
                          KRAFTIKA
                      </span>
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
                     className={cn(
                         "font-sans text-base font-medium transition-colors py-1",
                         pathname === item.href ? "text-primary font-semibold" : "text-foreground hover:text-foreground"
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
    
