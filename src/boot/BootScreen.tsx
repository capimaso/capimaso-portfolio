'use client';

import { useEffect, useState } from 'react';
import { LanguageProvider, useT } from '@/src/shared/LanguageContext';
import type { Language } from '@/lib/locale-dictionary';
import BiosScreen from './BiosScreen';
import BootManager from './BootManager';
import styles from './boot.module.css';

export default function BootScreen({ pending = false }: { pending?: boolean }) {
  const [language, setLanguage] = useState<Language>('en');
  const [bios, setBios] = useState(!pending);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('capimaso-xp-language');
      if (saved === 'pt' || saved === 'en') setLanguage(saved);
    } catch { /* Browsing remains available without storage. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!bios || pending) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBios(false);
      return;
    }
    const timer = window.setTimeout(() => setBios(false), 1500);
    const skip = (event: KeyboardEvent) => {
      if (['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
      event.preventDefault();
      setBios(false);
    };
    document.addEventListener('keydown', skip);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', skip);
    };
  }, [bios, pending]);

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  }, [language]);

  function changeLanguage(next: Language) {
    setLanguage(next);
    try { localStorage.setItem('capimaso-xp-language', next); } catch {}
  }

  return <LanguageProvider language={language}>
    <main className={styles.screen}>
      <div className={styles.content} inert={bios && hydrated}>
        {pending ? <PendingSystem /> : <BootManager enabled={!bios && hydrated} />}
        <div className={styles.languages} role="group" aria-label="Language / Idioma">
          <button type="button" aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>EN</button>
          <button type="button" aria-pressed={language === 'pt'} onClick={() => changeLanguage('pt')}>PT</button>
        </div>
      </div>
      {bios && <BiosScreen onSkip={() => setBios(false)} />}
      <noscript><style>{`.${styles.biosOverlay} { display: none; }`}</style></noscript>
    </main>
  </LanguageProvider>;
}

function PendingSystem() {
  const t = useT();
  return <section className={styles.manager}>
    <h1 className={styles.heading}>Windows 7</h1>
    <div className={styles.body}>
      <h2>{t('Portfólio de fotografias')}</h2>
      <p>{t('O Windows 7 está em construção. Meu portfólio de vídeos já está disponível no Windows XP.')}</p>
      <nav className={styles.pendingLinks} aria-label={t('Escolher sistema')}>
        <a href="/">{t('Voltar ao Boot Manager')}</a>
        <a href="/xp">{t('Abrir Windows XP')}</a>
      </nav>
    </div>
  </section>;
}
