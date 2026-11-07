'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLanguage, useT } from '@/src/shared/LanguageContext';
import type { Language } from '@/lib/locale-dictionary';
import { useSoundManager, useSystemMuted } from './SoundManager';
import styles from './logon.module.css';

function PowerSymbol() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M12 3v9M7 5.5a8.5 8.5 0 1 0 10 0" strokeLinecap="round" />
  </svg>;
}

export default function Logon({ onEnter, onLanguage }: { onEnter: () => void; onLanguage: (language: Language) => void }) {
  const t = useT(), language = useLanguage();
  const sounds = useSoundManager(), muted = useSystemMuted();
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [poweredOff, setPoweredOff] = useState(false);
  const password = useRef<HTMLInputElement>(null);
  const accessibility = useRef<HTMLDialogElement>(null);
  const power = useRef<HTMLDivElement>(null);
  const powerOn = useRef<HTMLAnchorElement>(null);
  useEffect(() => { if (window.matchMedia('(min-width: 720px)').matches) password.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => { if (poweredOff) powerOn.current?.focus(); }, [poweredOff]);

  function enter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Visual welcome screen only. Never read, store, validate or transmit the field.
    event.currentTarget.reset();
    onEnter();
  }

  function shutDown() {
    power.current?.hidePopover();
    setPoweredOff(true);
  }

  if (poweredOff) return <main className={styles.poweredOff} data-win7-powered-off>
    <h1>{t('Sessão do portfólio encerrada.')}</h1>
    <a ref={powerOn} href="/"><PowerSymbol />{t('Ligar')}</a>
  </main>;

  return <main className={styles.logon} data-win7-logon data-large-text={largeText} data-high-contrast={highContrast}
    aria-label={t('Tela de boas-vindas do Windows 7')}>
    <form className={styles.user} onSubmit={enter} autoComplete="off">
      <div className={styles.avatar}><img src="/images/profile.jpg" width={132} height={132} alt="CAPIMASO" draggable={false} /></div>
      <h1>CAPIMASO</h1>
      <div className={styles.credentials}>
        <input ref={password} type="password" autoComplete="off" placeholder={t('Senha')} aria-label={t('Senha')}
          aria-describedby="win7-logon-hint" />
        <button className={styles.enter} type="submit" aria-label={t('Entrar')} title={t('Entrar')}>
          <svg width="23" height="23" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h10L9 5l3-2 9 9-9 9-3-2 5-5H4z" fill="currentColor" /></svg>
        </button>
      </div>
      <p id="win7-logon-hint">{t('Portfólio público. Nenhuma senha é necessária.')}</p>
    </form>

    <div className={styles.languages} role="group" aria-label={t('Escolha um idioma')}>
      {(['en', 'pt'] as const).map(value => <button type="button" key={value} aria-pressed={language === value}
        onClick={() => onLanguage(value)}>{value.toUpperCase()}</button>)}
    </div>

    <footer className={styles.brand}>
      <p className={styles.wordmark} aria-label="Windows 7 Ultimate">
        <img src="/assets/win7/theme/windows-flag.svg" width={32} height={32} alt="" />
        <span>Windows<span className={styles.seven}>7</span></span><span className={styles.edition}>Ultimate</span>
      </p>
      <p className={styles.copyright}>© 2009 Microsoft Corporation. {t('Todos os direitos reservados.')}</p>
    </footer>

    <button type="button" className={styles.accessButton} title={t('Facilidade de Acesso')} aria-label={t('Facilidade de Acesso')}
      aria-haspopup="dialog" aria-controls="win7-logon-accessibility" onClick={() => accessibility.current?.showModal()}>
      <img src="/assets/win7/icons/Accessibility/accessibilitycpl_1.ico" width={24} height={24} alt="" />
    </button>
    <dialog ref={accessibility} id="win7-logon-accessibility" className={styles.accessPanel} aria-labelledby="win7-access-title">
      <h2 id="win7-access-title">{t('Facilidade de Acesso')}</h2>
      <p>{t('Ajustes de leitura para esta tela de entrada.')}</p>
      <label><input type="checkbox" checked={largeText} onChange={event => setLargeText(event.target.checked)} />{t('Aumentar o texto')}</label>
      <label><input type="checkbox" checked={highContrast} onChange={event => setHighContrast(event.target.checked)} />{t('Ativar alto contraste')}</label>
      <label><input type="checkbox" checked={muted} onChange={event => sounds.setMuted(event.target.checked)} />{t('Silenciar sons do sistema')}</label>
      <button type="button" onClick={() => accessibility.current?.close()}>{t('Fechar')}</button>
    </dialog>

    <div className={styles.powerButtons}>
      <button type="button" className={styles.shutDown} onClick={shutDown} aria-label={t('Desligar')} title={t('Desligar')}><PowerSymbol /></button>
      <button type="button" className={styles.powerOptions} popoverTarget="win7-logon-power" aria-label={t('Opções de desligamento')} title={t('Opções de desligamento')}>
        <svg width="10" height="8" viewBox="0 0 10 8" aria-hidden="true"><path d="m1 6 4-4 4 4z" fill="currentColor" /></svg>
      </button>
    </div>
    <div ref={power} id="win7-logon-power" className={styles.powerPanel} popover="auto">
      <a href="/">{t('Reiniciar')}</a>
      <button type="button" onClick={shutDown}>{t('Desligar')}</button>
    </div>
  </main>;
}
