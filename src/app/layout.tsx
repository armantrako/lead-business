import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Lead Business — Lead Finder for Autumn/Winter Tourism',
  description: 'Internal lead-finding tool for hotels and restaurants without official websites.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#0c0d0e] text-[#ededed] antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
