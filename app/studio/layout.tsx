import type { Metadata } from 'next';
import '@/src/os/win7/seven.css';

export const metadata: Metadata = { title: 'CAPIMASO | Studio', robots: { index: false, follow: false } };

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="win7">{children}</div>;
}
