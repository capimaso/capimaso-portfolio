'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { LanguageProvider, useT } from '@/src/shared/LanguageContext';
import type { Language } from '@/lib/locale-dictionary';
import { applications, type AppId } from './types';
import Win7Icon from './Win7Icon';
import styles from './win7.module.css';

export default function Win7Desktop() {
  const [language, setLanguage] = useState<Language>('en');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('capimaso-xp-language');
      if (saved === 'en' || saved === 'pt') setLanguage(saved);
    } catch {}
  }, []);
  useEffect(() => { document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en'; }, [language]);

  return <LanguageProvider language={language}><Desktop /></LanguageProvider>;
}

function Desktop() {
  const t = useT();
  const [selected, setSelected] = useState<AppId[]>([]);
  const shortcuts = useRef<(HTMLButtonElement | null)[]>([]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = Math.min(index + 1, applications.length - 1);
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = Math.max(index - 1, 0);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = applications.length - 1;
    else return;
    event.preventDefault();
    setSelected([applications[next].id]);
    shortcuts.current[next]?.focus();
  }

  return <main className={styles.desktop} aria-label={t('Área de trabalho Windows 7')}
    onPointerDown={event => {
      if (!(event.target as HTMLElement).closest('[data-shortcut]')) setSelected([]);
    }}>
    <div className={styles.shortcuts} aria-label={t('Área de trabalho')}>
      {applications.map((app, index) => <button type="button" key={app.id} data-shortcut={app.id}
        ref={element => { shortcuts.current[index] = element; }}
        className={styles.shortcut} aria-pressed={selected.includes(app.id)}
        onClick={event => setSelected(current => event.ctrlKey || event.metaKey
          ? current.includes(app.id) ? current.filter(id => id !== app.id) : [...current, app.id]
          : [app.id])}
        onKeyDown={event => navigate(event, index)}>
        <Win7Icon name={app.id} size={48} /><span>{t(app.label)}</span>
      </button>)}
    </div>
  </main>;
}
