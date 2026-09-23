import type { Metadata } from 'next';
import '../styles/globals.css';
import { profile } from '@/data/profile';

export const metadata: Metadata = {
  title: profile.metadata.title,
  description: profile.metadata.description,
  metadataBase: new URL('https://capimaso-portfolio.vercel.app'),
  openGraph: {
    title: profile.metadata.title,
    description: profile.metadata.description,
    type: 'website',
    url: 'https://capimaso-portfolio.vercel.app',
    images: ['/images/og.svg']
  },
  icons: {
    icon: '/icons/favicon.svg'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
