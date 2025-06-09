
import type { Metadata } from 'next';
// Removed Forum and Lato imports
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';

// Removed Forum and Lato font configurations

export const metadata: Metadata = {
  title: 'Kraftika Scents - Handcrafted Scented Candles',
  description: 'Where Scents Spark Joy. Premium, handcrafted scented candles from Kraftika.',
  icons: {
    icon: '/KraftikaV2.png', // Main favicon
    apple: '/KraftikaV2.png', // Apple touch icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
