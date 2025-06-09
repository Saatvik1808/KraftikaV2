
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Wand2 } from "lucide-react"; // Using Wand2 icon for quiz magic

export function ScentQuizSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-lilac relative overflow-hidden"> {/* Lilac Gradient */}
       {/* Optional: Add curved divider */}
       {/* <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent section-divider" style={{ clipPath: 'ellipse(100% 50% at 50% 100%)' }}></div> */}

        {/* Decorative elements */}
        <Sparkles className="absolute top-20 left-1/4 h-12 w-12 text-primary/10 opacity-60 animate-pulse -z-0" />
        <Sparkles className="absolute bottom-16 right-1/4 h-16 w-16 text-secondary/10 opacity-60 animate-pulse delay-300 -z-0" />

      <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Wand2 className="mx-auto h-12 w-12 text-primary mb-4" strokeWidth={1.5} />
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Uncover Your Signature Scent
          </h2>
          <p className="mt-3 text-lg text-muted-foreground/90 md:mt-4 max-w-2xl mx-auto mb-8">
            Answer a few fun questions and let us magically match you with the perfect Kraftika candle for your mood and style!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="inline-block"
          >
            <Button size="lg" className="btn-primary px-8 py-3"> {/* Use primary button style */}
              <Link href="/quiz">Take the Scent Quiz</Link> {/* Updated Link */}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
