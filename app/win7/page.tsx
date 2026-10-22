import type { Metadata } from 'next';
import BootScreen from '@/src/boot/BootScreen';

export const metadata: Metadata = { title: 'CAPIMASO | Windows 7 — Coming Soon' };

export default function Win7Page() {
  return <BootScreen pending />;
}
