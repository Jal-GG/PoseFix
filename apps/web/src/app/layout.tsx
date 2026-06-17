import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegistry } from './pwa-registry';
import { OfflineBanner } from '@/components/ui/OfflineBanner';

export const metadata: Metadata = {
  title: 'PoseFix — AI-Powered Pose Analysis',
  description: 'Real-time yoga and physiotherapy pose analysis platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PoseFix',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#030712',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        <PwaRegistry />
        <OfflineBanner />
        {children}
      </body>
    </html>
  );
}
