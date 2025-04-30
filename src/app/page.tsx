import { HeroSection } from '@/components/sections/hero-section';
import { ProductShowcase } from '@/components/sections/product-showcase';
import { Testimonials } from '@/components/sections/testimonials';
import { ScentQuizSection } from '@/components/sections/scent-quiz-section';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <ProductShowcase />
      <ScentQuizSection />
      <Testimonials />
    </div>
  );
}
