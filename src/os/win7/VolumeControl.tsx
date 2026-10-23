'use client';

import { useEffect, useRef, useState } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import { useSoundManager, useSystemMuted, useSystemVolume } from './SoundManager';
import styles from './volume-control.module.css';

function Speaker({ muted = false }: { muted?: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" stroke="#637482" strokeWidth=".7" strokeLinejoin="round" />
    {muted ? <path d="m11 6 4 4m0-4-4 4" stroke="#d74536" strokeWidth="1.5" />
      : <path d="M11 5.5c1.3 1.3 1.3 3.7 0 5M13 3.5c2.5 2.5 2.5 6.5 0 9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />}
  </svg>;
}

export default function VolumeControl() {
  const t = useT();
  const sounds = useSoundManager();
  const muted = useSystemMuted();
  const volume = useSystemVolume();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const preview = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const percent = Math.round(volume * 100);

  useEffect(() => () => { clearTimeout(preview.current); }, []);
  useEffect(() => {
    if (!open) return;
    slider.current?.focus();
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); button.current?.focus(); }
    };
    document.addEventListener('pointerdown', dismiss);
    root.current?.addEventListener('keydown', escape);
    const element = root.current;
    return () => { document.removeEventListener('pointerdown', dismiss); element?.removeEventListener('keydown', escape); };
  }, [open]);

  return <div className={styles.volume} ref={root} data-volume-control>
    <button type="button" ref={button} className={styles.trayButton} aria-label={`${t('Volume')}: ${percent}%`}
      title={`${t(muted ? 'O sistema está silenciado.' : 'Volume')}: ${percent}%`}
      aria-expanded={open} aria-controls="win7-volume-popup" onClick={() => setOpen(value => !value)}>
      <Speaker muted={muted || percent === 0} />
    </button>
    {open && <section id="win7-volume-popup" className={`window glass active ${styles.flyout}`} role="dialog" aria-label={t('Volume')}>
      <div className={styles.interior}>
        <output htmlFor="win7-volume-slider">{percent}</output>
        <input ref={slider} id="win7-volume-slider" type="range" min="0" max="100" step="1" value={percent}
          aria-label={t('Volume do sistema')} aria-orientation="vertical" aria-valuetext={`${percent}%`}
          onChange={event => {
            sounds.setVolume(Number(event.target.value) / 100);
            clearTimeout(preview.current);
            preview.current = setTimeout(() => sounds.play('ding'), 150);
          }} />
        <button type="button" className={styles.muteButton} aria-pressed={muted}
          aria-label={t(muted ? 'Ativar som' : 'Silenciar sistema')} onClick={() => sounds.setMuted(!muted)}>
          <Speaker muted={muted || percent === 0} />
        </button>
      </div>
    </section>}
  </div>;
}
