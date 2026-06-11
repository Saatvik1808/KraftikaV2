import { AboutSection } from '@/components/sections/about-section';
import { AboutExtras } from '@/components/sections/about-extras';
import { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com';

export const metadata: Metadata = {
  title: 'About Kraftika - Handcrafted Soy Candles Made in India | Our Story',
  description:
    "Meet Kraftika Studio: small-batch, hand-poured soy candles made in India. Our story, our craft process, and why natural ingredients matter — from wax to wick.",
  alternates: { canonical: `${siteUrl}/about` },
  openGraph: {
    title: 'About Kraftika - Our Story & Craft',
    description: 'Small-batch, hand-poured soy candles made in India with natural ingredients.',
    url: `${siteUrl}/about`,
    type: 'website',
  },
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Kraftika Studio',
  url: `${siteUrl}/about`,
  mainEntity: {
    '@type': 'Organization',
    name: 'Kraftika Studio',
    url: siteUrl,
    logo: `${siteUrl}/KraftikaV2.png`,
    description:
      'Kraftika Studio handcrafts premium scented soy candles in small batches in India, using natural soy wax, cotton wicks and fine fragrance oils.',
    founder: { '@type': 'Person', name: 'Anamika Sinha', jobTitle: 'Founder & Candlemaker' },
    areaServed: 'IN',
    email: 'studiokraftika@gmail.com',
  },
};

export default function AboutPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AboutSection />
      <AboutExtras />
    </div>
  );
}
