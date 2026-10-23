import type { Metadata } from 'next';
import '@/src/os/win7/seven.css';
import { availableWin7Sounds } from '@/src/server/win7-sounds';
import Win7Desktop from '@/src/os/win7/Win7Desktop';

export const metadata: Metadata = {
  title: 'CAPIMASO | Windows 7 — Photography',
  description: 'Tiago / CAPIMASO. Explore the Windows 7 photography desktop.',
};

export default function Win7Page() {
  return <Win7Desktop availableSounds={availableWin7Sounds()} />;
}
