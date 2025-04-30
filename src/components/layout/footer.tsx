import Link from "next/link";
import { Logo } from "@/components/logo"; // Assuming Logo component exists
import { Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo and Description */}
          <div className="flex flex-col items-start space-y-3">
             <Link href="/" className="flex items-center space-x-2 mb-2" aria-label="Kraftika Homepage">
               <Logo className="h-7 w-auto text-primary" />
               <span className="font-semibold text-lg text-primary">Kraftika</span>
             </Link>
            <p className="text-sm text-muted-foreground">
              Handcrafted scented candles to elevate your moments.
            </p>
             <div className="flex space-x-3 pt-2">
               <Link href="#" aria-label="Kraftika on Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                 <Twitter className="h-5 w-5" />
               </Link>
               <Link href="#" aria-label="Kraftika on Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                 <Instagram className="h-5 w-5" />
               </Link>
               <Link href="#" aria-label="Kraftika on Github" className="text-muted-foreground hover:text-primary transition-colors">
                 <Github className="h-5 w-5" />
               </Link>
             </div>
          </div>

          {/* Quick Links */}
          <div className="md:justify-self-center">
            <h4 className="mb-3 font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
               {/* <li>
                 <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                   About Us
                 </Link>
               </li> */}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:justify-self-end">
             <h4 className="mb-3 font-semibold text-foreground">Legal</h4>
             <ul className="space-y-2 text-sm">
               <li>
                 <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                   Privacy Policy
                 </Link>
               </li>
               <li>
                 <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                   Terms of Service
                 </Link>
               </li>
                <li>
                 <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                   Shipping & Returns
                 </Link>
               </li>
             </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Kraftika Scents. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
