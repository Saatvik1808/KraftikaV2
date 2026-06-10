'use client';

import { HeroSection } from '@/components/sections/hero-section';
import { ScrollReveal } from '@/components/candle/scroll-reveal';
import { WaxDivider } from '@/components/candle/wax-divider';
import dynamic from 'next/dynamic';

// Lazy load below-the-fold components for better initial page load
const ProductShowcase = dynamic(
  () => import('@/components/sections/product-showcase').then(mod => ({ default: mod.ProductShowcase })),
  {
    ssr: true,
    loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading products...</div></div>
  }
);

const AboutSection = dynamic(
  () => import('@/components/sections/about-section').then(mod => ({ default: mod.AboutSection })),
  { ssr: true }
);

const Testimonials = dynamic(
  () => import('@/components/sections/testimonials').then(mod => ({ default: mod.Testimonials })),
  { ssr: true }
);

const ScentQuizSection = dynamic(
  () => import('@/components/sections/scent-quiz-section').then(mod => ({ default: mod.ScentQuizSection })),
  { ssr: true }
);

const ContentSection = dynamic(
  () => import('@/components/sections/content-section').then(mod => ({ default: mod.ContentSection })),
  { ssr: true }
);

const FloatingWhatsAppButton = dynamic(
  () => import('@/components/floating-whatsapp-button').then(mod => mod.FloatingWhatsAppButton),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="flex flex-col items-stretch space-y-0 w-full">
      <HeroSection />

      {/* Melting wax edge out of the dark hero into the warm page */}
      <WaxDivider />

      <ScrollReveal>
        <ProductShowcase />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <ContentSection />
      </ScrollReveal>

      <ScrollReveal direction="left">
        <AboutSection />
      </ScrollReveal>

      <ScrollReveal direction="right">
        <ScentQuizSection />
      </ScrollReveal>

      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>

      <FloatingWhatsAppButton />
    </div>
  );
}
