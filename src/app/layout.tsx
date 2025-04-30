import type { Metadata } from 'next';
import { GeistSans as Geist } from 'next/font/google'; // Updated import
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import { Providers } from './providers'; // Import Providers

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// No need for geistMono if not used

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
