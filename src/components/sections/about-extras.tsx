"use client";

import Link from "next/link";
import { Flame, Leaf, Hand, Clock, Sparkles, PackageCheck, HeartHandshake, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/candle/scroll-reveal";

const processSteps = [
  {
    icon: Leaf,
    title: "Source",
    text: "100% natural soy wax, lead-free cotton wicks, and fine fragrance oils — every ingredient chosen for a clean, even burn.",
  },
  {
    icon: Flame,
    title: "Blend",
    text: "Each scent is blended by hand and tested across many pours until the throw is rich but never overwhelming.",
  },
  {
    icon: Hand,
    title: "Pour",
    text: "Small batches, hand-poured one jar at a time. No conveyor belts — just patience and a steady hand.",
  },
  {
    icon: Clock,
    title: "Cure",
    text: "Every candle rests for days before it ships, letting the fragrance bind fully with the wax for a stronger scent.",
  },
];

const values = [
  {
    icon: Sparkles,
    title: "Craft over volume",
    text: "We'd rather make fewer candles beautifully than many candles carelessly. Every batch is numbered and checked.",
  },
  {
    icon: Recycle,
    title: "Kind to your home",
    text: "Soy wax burns cleaner than paraffin — no black soot on your walls, no petroleum by-products in your air.",
  },
  {
    icon: HeartHandshake,
    title: "Made in India, with love",
    text: "Handcrafted by Indian artisans. Every purchase supports local craft over imported mass production.",
  },
  {
    icon: PackageCheck,
    title: "Honest products",
    text: "Real burn times, real ingredients on every label, and a 7-day return promise if something isn't right.",
  },
];

/** Craft process + values + CTA, rendered below the main About story. */
export function AboutExtras() {
  return (
    <>
      {/* How we craft */}
      <section className="w-full py-16 md:py-20 bg-gradient-to-b from-background to-secondary/15">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                How Every <span className="text-gradient-flame">Kraftika Candle</span> Is Made
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Four slow, careful steps — the opposite of a factory line.
              </p>
            </div>
          </ScrollReveal>
          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <StaggerItem key={step.title}>
                <div className="relative h-full rounded-2xl border border-border bg-card/70 p-6 candle-card">
                  <span className="absolute -top-3 -left-2 text-5xl font-bold text-primary/15 select-none">
                    {i + 1}
                  </span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 mb-4">
                    <step.icon className="h-5 w-5 text-amber-700" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Values */}
      <section className="w-full py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">What We Stand For</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The promises behind every jar that leaves our studio.
              </p>
            </div>
          </ScrollReveal>
          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="flex gap-4 rounded-2xl border border-border bg-card/70 p-6 h-full candle-card">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/50">
                    <v.icon className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full pb-20">
        <div className="container mx-auto max-w-4xl px-4 md:px-6">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-candlelight p-10 md:p-14 text-center">
              <div
                className="absolute inset-0 animate-glow-breathe pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 50% at 50% 30%, hsla(40,100%,64%,0.18), transparent 70%)",
                }}
              />
              <h2 className="relative text-2xl md:text-3xl font-bold text-white mb-3">
                Bring the warmth home
              </h2>
              <p className="relative text-white/80 max-w-xl mx-auto mb-7">
                Explore our hand-poured collection — soy candles crafted to make every evening feel
                a little softer.
              </p>
              <Button
                asChild
                size="lg"
                className="relative bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-9 shadow-candle-glow"
              >
                <Link href="/products">Shop the Collection</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
