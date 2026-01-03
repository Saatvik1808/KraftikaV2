import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wishlist | Kraftika',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





