'use client';

import { useEffect, useRef, useState } from 'react';
import { win7Startup } from '@/data/win7-startup';
import { useT } from '@/src/shared/LanguageContext';
import { useSoundManager, useStartupBlocked } from './SoundManager';
import styles from './startup.module.css';

export default function Startup({ onComplete }: { onComplete: () => void }) {
  const t = useT(), sounds = useSoundManager(), blocked = useStartupBlocked();
  const root = useRef<HTMLElement>(null);
  const [failed, setFailed] = useState(false);
  const video = failed ? '' : win7Startup.video;

  useEffect(() => {
    root.current?.focus({ preventScroll: true });
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeout = window.setTimeout(onComplete, reduced ? 500 : video ? win7Startup.videoTimeoutMs : win7Startup.fallbackDurationMs);
    return () => window.clearTimeout(timeout);
  }, [onComplete, video]);

  return <main ref={root} className={styles.startup} data-win7-startup tabIndex={-1}
    aria-label={t('Iniciando o Windows')} onKeyDown={event => { if (event.key === 'Escape') onComplete(); }}>
    {video ? <video className={styles.video} src={video} autoPlay muted playsInline preload="auto"
      aria-label={t('Iniciando o Windows')} onEnded={onComplete} onError={() => setFailed(true)} />
      : <div className={styles.fallback}><img src="/icons/orb.svg" alt="" width={96} height={96} /><p role="status">{t('Iniciando o Windows')}</p></div>}
    <div className={styles.controls}>
      {blocked && <button type="button" onClick={() => sounds.enable()}>{t('Iniciar com som')}</button>}
      <button type="button" onClick={onComplete}>{t('Pular inicialização')}</button>
    </div>
    <p className={styles.brand}>Windows 7</p>
  </main>;
}
