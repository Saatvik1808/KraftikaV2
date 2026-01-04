'use client';

import { HeroSection } from '@/components/sections/hero-section';
import dynamic from 'next/dynamic';

// Lazy load below-the-fold components for better initial page load
const ProductShowcase = dynamic(
  () => import('@/components/sections/product-showcase').then(mod => ({ default: mod.ProductShowcase })),
  { 
    ssr: true,
    loading: () => <div className="h-96 flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading products...</div></div>
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

const ValentineBanner = dynamic(
  () => import('@/components/sections/valentine-banner').then(mod => ({ default: mod.ValentineBanner })),
  { ssr: true }
);

const ContentSection = dynamic(
  () => import('@/components/sections/content-section').then(mod => ({ default: mod.ContentSection })),
  { ssr: true }
);

// Dynamically import the FloatingWhatsAppButton with SSR disabled for performance
const FloatingWhatsAppButton = dynamic(
  () => import('@/components/floating-whatsapp-button').then(mod => mod.FloatingWhatsAppButton),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-0"> {/* Remove default spacing if dividers handle it */}
      <ValentineBanner />
      <HeroSection />
      {/* Add Section Dividers if desired between sections */}
      {/* <SectionDivider /> */}
      <ProductShowcase />
      {/* <SectionDivider /> */}
      <ContentSection />
      {/* <SectionDivider /> */}
      <AboutSection /> {/* Add About Section */}
      {/* <SectionDivider /> */}
       <ScentQuizSection /> {/* Maybe move quiz after about? */}
      {/* <SectionDivider /> */}
      <Testimonials />
      <FloatingWhatsAppButton /> {/* Add the floating button here */}
    </div>
  );
}
