"use client"; // Added "use client" directive

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Twitter, Instagram, Facebook } from "lucide-react"; // Removed Pinterest and Github

// Inline SVG for Pinterest
const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0" // Adjust stroke width if needed, often brands prefer fill
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 1.013c-5.89 0-10.654 4.764-10.654 10.654 0 4.48 2.806 8.517 6.778 9.967.094-.424.157-1.15.157-1.15s-.22-.882-.22-1.947c0-1.816 1.047-3.172 2.35-3.172 1.11 0 1.65.834 1.65 1.833 0 1.11-.706 2.77-1.07 4.314-.296 1.25.62 2.26 1.855 2.26 2.22 0 3.92-2.88 3.92-6.945 0-3.62-2.61-6.166-6.02-6.166-4.037 0-6.43 3.02-6.43 5.96 0 1.13.346 2.33.78 3.06.085.14.1.27.07.41-.09.38-.3.12-.3.12s-.94-.376-.94-1.485c0-1.8.98-3.87 2.98-3.87 2.37 0 4.23 1.71 4.23 4.06 0 2.68-1.42 4.83-3.48 4.83-1.37 0-2.52-1.09-2.19-2.38.4-1.6 1.17-3.3 1.17-4.49 0-.93-.5-1.71-1.56-1.71-1.23 0-2.16 1.25-2.16 2.85 0 1.05.39 1.78.39 1.78s-1.26 5.34-1.49 6.29c-.46 1.86-.02 4.07-.02 4.07.02.11.2.18.3.15.1-.03 1.49-1.07 1.87-2.15.13-.37.79-3.16.79-3.16.26.5.98.92 1.79.92 2.26 0 3.79-2.4 3.79-5.61 0-2.67-2.08-4.89-4.93-4.89z"/>
  </svg>
);


export function Footer() {
  const iconVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.2, y: -2, color: 'hsl(var(--primary))' }, // Bounce and color change
  };

  return (
    <footer className="mt-auto border-t border-border/20 bg-gradient-to-tr from-accent/10 via-lilac/20 to-accent/10 py-12 md:py-16"> {/* Soft Yellow/Lilac Gradient */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-16">
          {/* Logo and Socials */}
          <div className="flex flex-col items-start space-y-4">
             <Link href="/" className="flex items-center space-x-2 mb-2 group" aria-label="Kraftika Homepage">
               <motion.div whileHover={{ rotate: [0, 5, -5, 0], transition: { duration: 0.4 } }}>
                  <Logo className="h-8 w-auto text-primary group-hover:animate-glow" />
               </motion.div>
               <span className="font-semibold text-lg text-primary group-hover:text-primary/80 transition-colors">Kraftika</span>
             </Link>
            <p className="text-sm text-muted-foreground/90">
              Handcrafted scents to spark joy in your everyday moments.
            </p>
             <div className="flex space-x-4 pt-2">
                 {/* Social Icons with Animation */}
                 {[
                    { Icon: Instagram, label: "Instagram", href: "#" },
                    { Icon: PinterestIcon, label: "Pinterest", href: "#" }, // Use SVG Component
                    { Icon: Facebook, label: "Facebook", href: "#" },
                    { Icon: Twitter, label: "Twitter", href: "#" },
                 ].map(({ Icon, label, href }) => (
                    <motion.a
                        key={label}
                        href={href}
                        aria-label={`Kraftika on ${label}`}
                        className="text-muted-foreground/70 hover:text-primary transition-colors"
                        variants={iconVariants}
                        whileHover="hover"
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                        <Icon className="h-5 w-5" />
                    </motion.a>
                 ))}
             </div>
          </div>

          {/* Quick Links */}
          <div className="md:justify-self-center">
            <h4 className="mb-4 font-semibold text-foreground/90">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-muted-foreground/80 hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-muted-foreground/80 hover:text-primary transition-colors">Products</Link></li>
              <li><Link href="/about" className="text-muted-foreground/80 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground/80 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="md:justify-self-center">
             <h4 className="mb-4 font-semibold text-foreground/90">Support</h4>
             <ul className="space-y-2.5 text-sm">
               <li><Link href="#" className="text-muted-foreground/80 hover:text-primary transition-colors">FAQ</Link></li>
               <li><Link href="#" className="text-muted-foreground/80 hover:text-primary transition-colors">Shipping & Returns</Link></li>
               <li><Link href="#" className="text-muted-foreground/80 hover:text-primary transition-colors">Privacy Policy</Link></li>
               <li><Link href="#" className="text-muted-foreground/80 hover:text-primary transition-colors">Terms of Service</Link></li>
             </ul>
          </div>

           {/* Newsletter Signup */}
           <div className="space-y-4">
               <h4 className="mb-3 font-semibold text-foreground/90">Stay Illuminated</h4>
                <p className="text-sm text-muted-foreground/80">Get scent inspiration and exclusive offers straight to your inbox.</p>
                <form className="flex flex-col sm:flex-row gap-2">
                    {/* Glass Input Field */}
                    <Input
                        type="email"
                        placeholder="Your email address"
                        className="flex-grow bg-background/50 backdrop-blur-sm border-border/30 placeholder:text-muted-foreground/60 focus:bg-background/70 focus:ring-primary/50 focus:border-primary/40 glassmorphism py-2 px-3 h-10 text-sm"
                        aria-label="Email for newsletter"
                    />
                     <Button type="submit" className="btn-primary h-10 text-sm px-4 shrink-0">
                        Subscribe
                    </Button>
                </form>
           </div>

        </div>

        <div className="mt-10 border-t border-border/30 pt-8 text-center text-xs text-muted-foreground/70">
          Crafted with love by Kraftika © {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
