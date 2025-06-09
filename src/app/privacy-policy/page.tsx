
"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full py-16 md:py-24 bg-gradient-to-br from-secondary/10 via-background to-secondary/5" // Light peach-ish gradient
    >
      <div className="container mx-auto max-w-4xl px-4 md:px-6 space-y-10">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-secondary mb-4 opacity-80" strokeWidth={1.5}/>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-3">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground/90">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
          </p>
        </div>

        <div className="space-y-6 glassmorphism p-6 md:p-10 border border-[hsl(var(--border)/0.2)] text-muted-foreground/80 leading-relaxed font-sans">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <p>
            Kraftika Scents ("us", "we", or "our") operates the Kraftika Scents website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">Information Collection and Use</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
              <li>Personal Data: While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to, your email address, name, phone number, and shipping address.</li>
              <li>Usage Data: We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</li>
              <li>Tracking & Cookies Data: We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">Use of Data</h2>
            <p>Kraftika Scents uses the collected data for various purposes:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
              <li>To provide and maintain the Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer care and support</li>
              <li>To provide analysis or valuable information so that we can improve the Service</li>
              <li>To monitor the usage of the Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">Your Rights</h2>
            <p>
              You have the right to access, update, or delete the information we have on you. Whenever made possible, you can access, update or request deletion of your Personal Data directly within your account settings section. If you are unable to perform these actions yourself, please contact us to assist you.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "last updated" date at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold font-heading text-foreground/90 mb-2">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us by email: <a href="mailto:studiokraftika@gmail.com" className="text-primary hover:underline">studiokraftika@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
