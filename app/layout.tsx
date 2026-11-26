import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { SITE } from '@/lib/site';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display-loaded',
  display: 'swap',
});

const monoFont = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'AI travel companion',
    'travel assistant',
    'Synodos',
    'smart travel',
    'trip planning',
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: 'website',
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name,
    images: [`${SITE.url}assets/images/hero-aurora.webp`],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: [`${SITE.url}assets/images/hero-aurora.webp`],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#e2231a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${displayFont.variable} ${monoFont.variable}`}>
      <body>
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
