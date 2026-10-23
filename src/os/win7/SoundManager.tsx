'use client';

import { createContext, useContext, useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import type { Win7Sound } from '@/src/lib/win7-sounds';
import { SoundManager, type SystemSounds } from './sound-manager';

const silent: SystemSounds = { enable() {}, play() {}, dispose() {}, getMuted: () => false, setMuted() {}, subscribe: () => () => {} };
const SoundContext = createContext<SystemSounds>(silent);
export const useSoundManager = () => useContext(SoundContext);
export function useSystemMuted() {
  const sounds = useSoundManager();
  return useSyncExternalStore(sounds.subscribe, sounds.getMuted, () => false);
}

export default function SoundManagerProvider({ available, children }: { available: Win7Sound[]; children: ReactNode }) {
  const manager = useRef<SoundManager | null>(null);
  if (!manager.current) manager.current = new SoundManager(available);
  useEffect(() => () => manager.current?.dispose(), []);
  return <SoundContext.Provider value={manager.current}>{children}</SoundContext.Provider>;
}
