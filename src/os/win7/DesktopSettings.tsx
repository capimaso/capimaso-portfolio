'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export const desktopWallpapers = ['desktop-logo.jpg', 'harmony.jpg'] as const;
export type DesktopWallpaper = typeof desktopWallpapers[number];
const storageKey = 'capimaso-win7-wallpaper';
const Settings = createContext({ wallpaper: desktopWallpapers[0] as DesktopWallpaper, setWallpaper: (_value: DesktopWallpaper) => {} });
export const useDesktopSettings = () => useContext(Settings);

export default function DesktopSettingsProvider({ children }: { children: ReactNode }) {
  const [wallpaper, update] = useState<DesktopWallpaper>('desktop-logo.jpg');
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (desktopWallpapers.some(item => item === saved)) update(saved as DesktopWallpaper);
    } catch {}
  }, []);
  function setWallpaper(value: DesktopWallpaper) {
    update(value);
    try { localStorage.setItem(storageKey, value); } catch {}
  }
  return <Settings.Provider value={{ wallpaper, setWallpaper }}>{children}</Settings.Provider>;
}
