import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Kraftika',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}





