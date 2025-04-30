import type { Metadata } from 'next';
import { Poppins } from 'next/font/google'; // Import Poppins
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import { Providers } from './providers'; // Import Providers

// Configure Poppins font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Include necessary weights
  variable: '--font-poppins', // Define CSS variable
});

export const metadata: Metadata = {
  title: 'Kraftika Scents - Handcrafted Scented Candles',
  description: 'Where Scents Spark Joy. Premium, handcrafted scented candles from Kraftika.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply the font variable to the body */}
      <body className={`${poppins.variable} font-sans antialiased flex flex-col min-h-screen`}>
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
