
 "use client";

 import * as React from "react";
 import Link from "next/link";
 import { motion, useScroll, useMotionValueEvent } from "framer-motion";
 import { Menu, X, ShoppingBag } from "lucide-react";

 import { cn } from "@/lib/utils";
 import { Button } from "@/components/ui/button";
 import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
 import { Logo } from "@/components/logo";
 import { usePathname } from 'next/navigation'; // Import usePathname


 const navItems = [
   { name: "Home", href: "/" },
   { name: "Products", href: "/products" },
   { name: "About Us", href: "/about" }, // Added About Us
   { name: "Contact", href: "/contact" },
   { name: "FAQ", href: "/faq"} // Added FAQ
 ];

 export function Navbar() {
   const [isOpen, setIsOpen] = React.useState(false);
   const [isScrolled, setIsScrolled] = React.useState(false);
   const { scrollY } = useScroll();
   const pathname = usePathname(); // Get current path

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
             className="flex items-center justify-center" // Center the image within the div
            >
             {/* Adjust width/height directly or use className for Tailwind size */}
             <Logo width={32} height={32} priority className="transition-all duration-300 group-hover:animate-glow" />
            </motion.div>
            {/* Changed text color to primary-foreground for darker appearance */}
            <span className="font-heading font-semibold text-lg text-primary-foreground transition-colors group-hover:text-primary-foreground/80">Kraftika</span>
         </Link>

         {/* Desktop Navigation */}
         <div className="hidden items-center space-x-6 md:flex">
           {navItems.map((item) => (
             <motion.div
               key={item.name}
               whileHover="hover"
               animate={pathname === item.href ? "hover" : "rest"} // Keep underline if active
               variants={{ // Define variants for hover state
                  hover: { y: -2 },
                  rest: { y: 0 }
                }}
               transition={{ type: "spring", stiffness: 400, damping: 10 }}
               className="relative group" // group is used for the underline animation
             >
               <Link
                 href={item.href}
                 className={cn(
                     "font-sans text-sm font-medium transition-colors relative z-10",
                      pathname === item.href ? "text-primary font-semibold" : "text-foreground/90 hover:text-foreground" // Style active link
                  )}
                  style={pathname === item.href ? { textShadow: "0 0 8px hsla(var(--primary-hsl), 0.6)" } : {}} // Apply shadow if active
                >
                  {item.name}
                  {/* Underline Ripple Animation - positioned below the link */}
                  <motion.span
                    className="absolute left-0 -bottom-1 block h-[2px] w-full bg-primary origin-center"
                    initial={{ scaleX: 0 }}
                    // Animate scaleX on group hover (parent motion.div) or if active
                    variants={{
                      hover: { scaleX: 1 },
                      rest: { scaleX: pathname === item.href ? 1 : 0 } // Keep scaled if active
                    }}
                    transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                    style={{ transformOrigin: 'center' }} // Ensure scaling from center
                  />
               </Link>
             </motion.div>
           ))}
            {/* Cart Icon Link */}
            <Button asChild variant="ghost" size="icon" className="relative hover:bg-primary/10" aria-label="Shopping Cart">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5 text-foreground/80 hover:text-primary" />
                {/* TODO: Add item count badge dynamically */}
                {/* <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">0</span> */}
              </Link>
            </Button>
         </div>


         {/* Mobile Navigation Trigger */}
         <div className="flex items-center md:hidden">
          <Button asChild variant="ghost" size="icon" className="relative mr-2 hover:bg-primary/10" aria-label="Shopping Cart">
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5 text-foreground/80 hover:text-primary" />
              {/* TODO: Add item count badge dynamically */}
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
                      <Logo width={28} height={28} className="text-primary" /> {/* Slightly smaller logo for mobile */}
                      <span className="font-heading font-semibold text-md text-primary-foreground">Kraftika</span>
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
                     onClick={() => setIsOpen(false)} // Close sheet on navigation
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
    
