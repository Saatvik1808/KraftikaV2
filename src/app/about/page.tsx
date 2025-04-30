import { AboutSection } from '@/components/sections/about-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Kraftika - Our Story & Vision',
  description: 'Learn about Kraftika\'s passion for handcrafted candles, our vision for joyful living, and what makes our scents special.',
};

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24">
       {/* You can add more content specific to the About page here if needed */}
       {/* For now, we reuse the AboutSection component */}
      <AboutSection />
      {/* Example: Add a team section or more details */}
      {/* <section className="container mx-auto max-w-5xl px-4 md:px-6 mt-16">
        <h2 className="text-3xl font-bold text-center mb-10">Meet the Maker</h2>
        {/* Add content about the founder/team */}
      {/* </section> */}
    </div>
  );
}
