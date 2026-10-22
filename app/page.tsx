import type { Metadata } from 'next';
import BootScreen from '@/src/boot/BootScreen';

export const metadata: Metadata = {
  title: 'CAPIMASO | Windows Boot Manager',
  description: 'Choose Windows XP for videos or Windows 7 for photography. Tiago / CAPIMASO.',
};

export default function Home() {
  return <BootScreen />;
}
