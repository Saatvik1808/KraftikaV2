import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Corrected import path for GeistSans
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import { Providers } from './providers'; // Import Providers

const geistSans = GeistSans; // Use the imported font object directly

export const metadata: Metadata = {
  title: 'Kraftika Scents - Handcrafted Scented Candles',
  description: 'Light up your life with premium, handcrafted scented candles from Kraftika.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased flex flex-col min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster /> {/* Add Toaster component here */}
        </Providers>
      </body>
    </html>
  );
}
