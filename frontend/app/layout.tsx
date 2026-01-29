/**
 * Root Layout
 * 
 * Main layout wrapper for the entire application.
 * Includes global providers, fonts, and metadata.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthInitializer from '@/components/layout/AuthInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Startup Benefits Platform - Exclusive SaaS Deals for Startups',
  description:
    'Access exclusive deals and partnerships on premium SaaS tools. Cloud services, marketing tools, analytics, and more for early-stage startups.',
  keywords: 'startup deals, saas deals, startup benefits, cloud credits, marketing tools',
  authors: [{ name: 'Startup Benefits Platform' }],
  openGraph: {
    title: 'Startup Benefits Platform',
    description: 'Exclusive SaaS deals for startups',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthInitializer />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}