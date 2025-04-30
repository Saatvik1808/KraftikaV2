import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Instagram, Facebook, Pinterest } from "lucide-react"; // Added FB, Pinterest

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
                    { Icon: Pinterest, label: "Pinterest", href: "#" },
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
