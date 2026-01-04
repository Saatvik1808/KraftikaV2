
import type { Metadata } from 'next';
// Removed Forum and Lato imports
import './globals.css';
import { ConditionalLayout } from '@/components/layout/conditional-layout';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import { PWAInstallPrompt } from '@/components/pwa-install-prompt';

// Comprehensive SEO Optimized Metadata
export const metadata: Metadata = {
  title: {
    default: 'Kraftika - Home Made Scented Candles | Handcrafted Candles India',
    template: '%s | Kraftika - Home Made Scented Candles',
  },
  description: 'Kraftika offers premium home made scented candles and handcrafted candles in India. Shop the finest collection of Kraftika candles - natural soy wax, hand-poured, aromatherapy candles. Buy homemade candles online with free shipping.',
  keywords: [
    'home made candles',
    'homemade candles',
    'scented candles',
    'kraftika candles',
    'kraftika',
    'handcrafted candles',
    'hand made candles',
    'home made scented candles',
    'homemade scented candles',
    'kraftika scented candles',
    'handcrafted scented candles',
    'soy candles',
    'natural candles',
    'aromatherapy candles',
    'premium candles',
    'buy candles online',
    'candles india',
    'hand poured candles',
    'artisan candles',
    'luxury candles',
    'kraftika studio',
    'kraftika candle shop',
    'kraftika online store',
    'best scented candles india',
    'candle shop india',
    'soy wax candles',
    'candles for home decor',
    'gift candles',
    'wedding candles',
    'gift ideas',
    'christmas candles',
    'christmas gift candles',
    'new year candles',
    'christmas candles india',
    'holiday candles',
    'christmas scented candles',
    'festive candles',
    'christmas gift ideas',
    'best christmas candles',
    'luxury christmas candles',
    'handmade christmas candles',
    'christmas candle gift sets'
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
    title: 'Kraftika - Home Made Scented Candles | Handcrafted Candles India',
    description: 'Premium home made scented candles and handcrafted candles from Kraftika. Natural soy wax, hand-poured in India. Shop Kraftika candles online.',
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
    title: 'Kraftika - Home Made Scented Candles | Handcrafted Candles India',
    description: 'Premium home made scented candles and handcrafted candles from Kraftika. Natural soy wax, hand-poured in India. Shop Kraftika candles online.',
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kraftika',
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
  description: 'Kraftika offers premium home made scented candles and handcrafted candles in India. Natural soy wax, hand-poured, aromatherapy candles. Where scents spark joy!',
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
  name: 'Kraftika - Home Made Scented Candles',
  url: siteUrl,
  description: 'Premium home made scented candles and handcrafted candles in India. Shop Kraftika candles - natural soy wax, hand-poured, aromatherapy candles online.',
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
        name: 'Kraftika Home Made Scented Candles Collection',
        url: `${siteUrl}/products`,
        description: 'Browse our complete collection of home made scented candles and handcrafted candles from Kraftika',
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
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        
        {/* Preload critical LCP image */}
        <link 
          rel="preload" 
          href="/aesV2.jpeg" 
          as="image" 
          fetchPriority="high"
        />
        
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
                send_page_view: true,
                // Enhanced tracking for India market
                country_id: 'IN',
                currency: 'INR',
                // Enable enhanced ecommerce tracking
                send_to: 'G-2PE2MFNQ1L'
              });
              
              // Track geographic data
              gtag('set', {
                'country': 'IN',
                'currency': 'INR'
              });
              
              // Track conversions
              gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />
        {/* Google AdSense - Deferred for better performance */}
        <script
          defer
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3381696955327461"
          crossOrigin="anonymous"
        />
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Kraftika" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kraftika" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/KraftikaV2.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      {/* Apply the font-sans class which will now use Regalia Monarch via Tailwind config */}
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <Providers>
          <ConditionalLayout>
            <main className="flex-grow">{children}</main>
          </ConditionalLayout>
          <Toaster />
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
