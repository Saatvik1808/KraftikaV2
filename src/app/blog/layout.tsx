import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Kraftika Candle Care Tips & Guides',
  description: 'Discover expert tips, guides, and insights about scented candles, aromatherapy, home decor, and sustainable living from Kraftika.',
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
    title: 'Kraftika Blog - Candle Care Tips & Guides',
    description: 'Discover expert tips, guides, and insights about scented candles, aromatherapy, home decor, and sustainable living.',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}



