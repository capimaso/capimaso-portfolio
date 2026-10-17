import type { Metadata } from 'next';
import './xp.css';
import { profile } from '@/data/profile';

export const metadata: Metadata = {
  title: `${profile.brand} | Video Editor`,
  description: 'Tiago (CAPIMASO): video editing for gaming, creators, Reels, Shorts and long-form video.',
  openGraph: { title: `${profile.brand} | Portfolio`, description: 'Tiago (CAPIMASO): video editing for gaming, creators, Reels, Shorts and long-form video.', type: 'website', images: ['/images/og.svg'] },
  icons: { icon: '/icons/favicon.svg' }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
