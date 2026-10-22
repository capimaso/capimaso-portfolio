import type { Metadata } from 'next';
import '@/src/os/xp/xp.css';

export const metadata: Metadata = {
  title: 'CAPIMASO | Windows XP — Video Portfolio',
};

export default function XpLayout({ children }: { children: React.ReactNode }) {
  return <div className="xp-shell">{children}</div>;
}
