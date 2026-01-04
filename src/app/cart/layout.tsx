import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | Kraftika',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}






