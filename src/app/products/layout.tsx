import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Home Made Scented Candles | Kraftika Candles Collection',
  description: 'Browse our complete collection of premium home made scented candles and handcrafted candles from Kraftika. Citrus, Floral, Sweet, Fresh & Fruity scents available. Buy Kraftika candles online - free shipping India.',
  keywords: [
    'home made candles',
    'homemade candles',
    'scented candles',
    'kraftika candles',
    'kraftika',
    'handcrafted candles',
    'kraftika candles online',
    'buy scented candles india',
    'handcrafted candles collection',
    'soy candles shop',
    'aromatherapy candles',
    'luxury candles india',
    'premium scented candles',
    'citrus candles',
    'floral candles',
    'sweet scented candles',
    'fresh candles',
    'fruity candles',
    'kraftika products',
    'candle collection',
    'home made scented candles',
    'homemade scented candles',
  ],
  openGraph: {
    title: 'Shop Handcrafted Scented Candles | Kraftika Products',
    description: 'Browse our complete collection of premium handcrafted scented soy candles. Find your perfect scent today!',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com'}/products`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kraftikastudio.com'}/products`,
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

