
import type { Metadata } from 'next';
// Removed Forum and Lato imports
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';

// SEO Optimized Metadata
export const metadata: Metadata = {
  title: 'Kraftika - Handcrafted Scented Soy Candles in India',
  description: 'Discover Kraftika, your home for premium handcrafted scented soy candles in India. Lovingly hand-poured with natural waxes and unique fragrances to spark joy in every moment.',
  keywords: ['scented candles', 'handcrafted candles', 'soy candles', 'Kraftika', 'India', 'home decor', 'aroma', 'fragrance'],
  icons: {
    icon: '/KraftikaV2.png', // Main favicon
    apple: '/KraftikaV2.png', // Apple touch icon
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kraftika-scents.com';

// Organization Schema for Google
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kraftika',
  url: siteUrl,
  logo: `${siteUrl}/KraftikaV2.png`,
  sameAs: [
    'https://www.instagram.com/kraftika_studio/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9625901437',
    contactType: 'Customer Service',
    email: 'studiokraftika@gmail.com'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* Apply the font-sans class which will now use Regalia Monarch via Tailwind config */}
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
