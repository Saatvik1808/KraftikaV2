
import type { Metadata } from 'next';
// Removed Forum and Lato imports
import './globals.css';
import { ConditionalLayout } from '@/components/layout/conditional-layout';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';

// Comprehensive SEO Optimized Metadata
export const metadata: Metadata = {
  title: {
    default: 'Kraftika - Premium Handcrafted Scented Candles | Best Candle Shop in India',
    template: '%s | Kraftika - Handcrafted Scented Candles',
  },
  description: 'Kraftika offers premium handcrafted scented soy candles in India. Shop the finest collection of aromatherapy candles, fragrance candles, and luxury candles. Where scents spark joy! Buy Kraftika candles online - best scented candles India.',
  keywords: [
    'kraftika candles', 'kraftika scented candles', 'handcrafted candles', 'scented candles india', 
    'soy candles', 'aromatherapy candles', 'fragrance candles', 'luxury candles', 'premium candles',
    'best scented candles india', 'buy candles online', 'candle shop india', 'soy wax candles',
    'natural candles', 'hand poured candles', 'homemade candles', 'artisan candles',
    'candles for home decor', 'gift candles', 'wedding candles', 'gift ideas',
    'kraftika studio', 'kraftika candle shop', 'kraftika online store'
  ],
  authors: [{ name: 'Kraftika' }],
  creator: 'Kraftika',
  publisher: 'Kraftika',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com',
    siteName: 'Kraftika - Handcrafted Scented Candles',
    title: 'Kraftika - Premium Handcrafted Scented Candles | Best Candle Shop in India',
    description: 'Kraftika offers premium handcrafted scented soy candles in India. Shop the finest collection of aromatherapy candles, fragrance candles, and luxury candles. Where scents spark joy!',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kraftika-scents.com'}/KraftikaV2.png`,
        width: 1200,
        height: 630,
        alt: 'Kraftika - Handcrafted Scented Candles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kraftika - Premium Handcrafted Scented Candles | Best Candle Shop in India',
    description: 'Shop premium handcrafted scented soy candles from Kraftika. Where scents spark joy!',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://kraftika-scents.com'}/KraftikaV2.png`],
    creator: '@kraftika_studio',
    site: '@kraftika_studio',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://kraftika-scents.com',
  },
  icons: {
    icon: '/KraftikaV2.png',
    apple: '/KraftikaV2.png',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kraftika-scents.com'),
  verification: {
    google: 'your-google-verification-code', // Replace with your Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com';

// Enhanced Organization Schema for Google Rich Results
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kraftika',
  alternateName: 'Kraftika Studio',
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/KraftikaV2.png`,
    width: 512,
    height: 512,
  },
  image: `${siteUrl}/KraftikaV2.png`,
  description: 'Kraftika offers premium handcrafted scented soy candles in India. Where scents spark joy!',
  sameAs: [
    'https://www.instagram.com/kraftika_studio/',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9625901437',
    contactType: 'Customer Service',
    email: 'studiokraftika@gmail.com',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi'],
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
};

// Website Schema for better SEO with CollectionPage
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Kraftika - Handcrafted Scented Candles',
  url: siteUrl,
  description: 'Premium handcrafted scented soy candles in India. Shop the best scented candles, aromatherapy candles, and fragrance candles online.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/products?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'CollectionPage',
        name: 'Kraftika Scented Candles Collection',
        url: `${siteUrl}/products`,
        description: 'Browse our complete collection of handcrafted scented soy candles',
      },
    },
  },
};

// LocalBusiness Schema (if you have a physical store)
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Kraftika',
  image: `${siteUrl}/KraftikaV2.png`,
  '@id': `${siteUrl}#organization`,
  url: siteUrl,
  telephone: '+91-9625901437',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    // Add your coordinates if you have a physical location
    // latitude: '28.6139',
    // longitude: '77.2090',
  },
  sameAs: [
    'https://www.instagram.com/kraftika_studio/',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2PE2MFNQ1L"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2PE2MFNQ1L');
            `,
          }}
        />
        {/* Enhanced Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {/* Enhanced Google Analytics with Conversion Tracking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2PE2MFNQ1L', {
                page_path: window.location.pathname,
                send_page_view: true
              });
              
              // Track conversions
              gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3381696955327461"
          crossOrigin="anonymous"
        />
      </head>
      {/* Apply the font-sans class which will now use Regalia Monarch via Tailwind config */}
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Providers>
          <ConditionalLayout>
            <main className="flex-grow">{children}</main>
          </ConditionalLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
