'use client';

import { useEffect, useRef, type FormEvent } from 'react';
import { useLanguage, useT } from '@/src/shared/LanguageContext';
import type { Language } from '@/lib/locale-dictionary';
import styles from './logon.module.css';

export default function Logon({ onEnter, onLanguage }: { onEnter: () => void; onLanguage: (language: Language) => void }) {
  const t = useT(), language = useLanguage();
  const password = useRef<HTMLInputElement>(null);
  useEffect(() => { if (window.matchMedia('(min-width: 720px)').matches) password.current?.focus({ preventScroll: true }); }, []);

  function enter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Visual welcome screen only. Never read, store, validate or transmit the field.
    event.currentTarget.reset();
    onEnter();
  }

  return <main className={styles.logon} data-win7-logon aria-label={t('Tela de boas-vindas do Windows 7')}>
    <form className={styles.user} onSubmit={enter} autoComplete="off">
      <div className={styles.avatar}><img src="/images/profile.jpg" width={96} height={96} alt="CAPIMASO" draggable={false} /></div>
      <h1>CAPIMASO</h1>
      <div className={styles.credentials}>
        <input ref={password} type="password" autoComplete="off" placeholder={t('Senha')} aria-label={t('Senha')}
          aria-describedby="win7-logon-hint" />
        <button className={styles.enter} type="submit" aria-label={t('Entrar')} title={t('Entrar')}>➜</button>
      </div>
      <p id="win7-logon-hint">{t('Portfólio público. Nenhuma senha é necessária.')}</p>
    </form>
    <div className={styles.languages} role="group" aria-label={t('Escolha um idioma')}>
      {(['en', 'pt'] as const).map(value => <button type="button" key={value} aria-pressed={language === value}
        onClick={() => onLanguage(value)}>{value.toUpperCase()}</button>)}
    </div>
    <p className={styles.brand}>Windows <strong>7</strong></p>
  </main>;
}
