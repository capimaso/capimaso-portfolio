import type { Metadata } from 'next';
import '../styles/globals.css';
import '../styles/portfolio-upgrades.css';
import { profile } from '@/data/profile';

export const metadata: Metadata = {
  title: profile.metadata.title,
  description: 'Portfólio pessoal de edição de vídeo focado em gaming, criadores e vídeos curtos e longos.',
  metadataBase: new URL('https://capimaso-portfolio.vercel.app'),
  openGraph: {
    title: profile.metadata.title,
    description: 'Portfólio pessoal de edição de vídeo focado em gaming, criadores e vídeos curtos e longos.',
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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
