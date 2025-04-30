"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react"; // Using Sparkles icon

export function ScentQuizSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-tr from-accent/10 via-background to-primary/10">
      <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Find Your Perfect Scent
          </h2>
          <p className="mt-3 text-lg text-muted-foreground md:mt-4 max-w-2xl mx-auto mb-8">
            Not sure where to start? Take our quick quiz to discover the Kraftika candle that matches your vibe.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="inline-block"
          >
            <Button size="lg" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/30 transition-shadow">
              {/* In a real app, this would link to a /quiz page or open a modal */}
              <Link href="#">Take the Scent Quiz</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
