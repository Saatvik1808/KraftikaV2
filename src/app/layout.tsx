import type { Metadata } from 'next';
import { Forum, Lato } from 'next/font/google'; // Import Forum and Lato
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import { Providers } from './providers'; // Import Providers

// Configure Forum font for headings
const forum = Forum({
  subsets: ['latin'],
  weight: ['400'], // Forum only has regular weight
  variable: '--font-forum', // Define CSS variable for headings
});

// Configure Lato font for body
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'], // Include necessary weights
  variable: '--font-lato', // Define CSS variable for body
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
      {/* Apply the font variables to the body */}
      <body className={`${forum.variable} ${lato.variable} font-sans antialiased flex flex-col min-h-screen`}>
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
