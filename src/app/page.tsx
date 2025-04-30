import { HeroSection } from '@/components/sections/hero-section';
import { ProductShowcase } from '@/components/sections/product-showcase';
import { AboutSection } from '@/components/sections/about-section'; // Import AboutSection
import { Testimonials } from '@/components/sections/testimonials';
import { ScentQuizSection } from '@/components/sections/scent-quiz-section';

export default function Home() {
  return (
    <div className="flex flex-col items-center space-y-0"> {/* Remove default spacing if dividers handle it */}
      <HeroSection />
      {/* Add Section Dividers if desired between sections */}
      {/* <SectionDivider /> */}
      <ProductShowcase />
      {/* <SectionDivider /> */}
      <AboutSection /> {/* Add About Section */}
      {/* <SectionDivider /> */}
       <ScentQuizSection /> {/* Maybe move quiz after about? */}
      {/* <SectionDivider /> */}
      <Testimonials />
    </div>
  );
}
