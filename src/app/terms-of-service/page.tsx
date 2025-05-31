
"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-16 md:py-24 bg-gradient-to-br from-lilac/10 via-background to-lilac/5" // Light lilac-ish gradient
    >
      <div className="container mx-auto max-w-4xl px-4 md:px-6 space-y-10">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-lilac mb-4 opacity-80" strokeWidth={1.5}/>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-3">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground/90">
            Please read these terms and conditions carefully before using Our Service.
          </p>
        </div>

        <div className="space-y-6 glassmorphism p-6 md:p-10 border border-[hsl(var(--border)/0.2)] text-muted-foreground/80 leading-relaxed font-sans">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Kraftika Scents website (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Service's particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this Service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">2. Use of Our Service</h2>
            <p>
              You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Service. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content or disrupting the normal flow of dialogue within our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">3. Intellectual Property</h2>
            <p>
              All content included on the Service, such as text, graphics, logos, images, as well as the compilation thereof, and any software used on the Service, is the property of Kraftika Scents or its suppliers and protected by copyright and other laws that protect intellectual property and proprietary rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">4. Products and Pricing</h2>
            <p>
              All descriptions of products or product pricing are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time. Any offer for any product or service made on this site is void where prohibited. We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">5. Limitation of Liability</h2>
            <p>
              In no event shall Kraftika Scents, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">6. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">7. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us by email: <a href="mailto:saatvik.shrivastava08@gmail.com" className="text-primary hover:underline">saatvik.shrivastava08@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
