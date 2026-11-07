'use client';

import { useEffect, useState } from 'react';
import { useLanguage, useT } from '@/src/shared/LanguageContext';
import type { Language } from '@/lib/locale-dictionary';
import { windowApplications as applications, type AppId, type AppWindow } from './types';
import Win7Icon from './Win7Icon';
import StartOrb from './StartOrb';
import VolumeControl from './VolumeControl';
import styles from './win7.module.css';

type Props = {
  startOpen: boolean;
  onStart: () => void;
  windows: AppWindow[];
  activeId?: AppId;
  onOpen: (id: AppId) => void;
  onTask: (id: AppId) => void;
  onShowDesktop: () => void;
  onLanguage: (language: Language) => void;
};

export default function Taskbar({ startOpen, onStart, windows, activeId, onOpen, onTask, onShowDesktop, onLanguage }: Props) {
  const t = useT();
  const language = useLanguage();
  const [clock, setClock] = useState({ time: '--:--', date: '', full: '' });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const locale = language === 'pt' ? 'pt-BR' : 'en-US';
      setClock({
        time: now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false }),
        date: now.toLocaleDateString(locale),
        full: now.toLocaleDateString(locale, { dateStyle: 'full' }),
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [language]);

  return <footer className={`window glass active ${styles.taskbar}`} aria-label={t('Barra de tarefas')} data-taskbar>
    <StartOrb open={startOpen} onToggle={onStart} />
    <div className={styles.pinned}>
      {(['images', 'videos'] as const).filter(id => !windows.some(win => win.id === id)).map(id => <button
        type="button" key={id} title={t(applications.find(app => app.id === id)!.label)} onClick={() => onOpen(id)}>
        <Win7Icon name={id} />
      </button>)}
    </div>
    <div className={styles.tasks}>
      {windows.map(win => <button type="button" key={win.id} data-task={win.id}
        className={`${styles.task} ${!win.minimized && activeId === win.id ? styles.currentTask : ''}`}
        aria-label={t(applications.find(app => app.id === win.id)!.label)}
        aria-pressed={!win.minimized && activeId === win.id} onClick={() => onTask(win.id)}
        title={t(applications.find(app => app.id === win.id)!.label)}>
        <Win7Icon name={win.id} />
      </button>)}
    </div>
    <div className={styles.tray}>
      <div className={`${styles.languageSwitch} ${styles.desktopLanguages}`} role="group" aria-label={t('Escolha um idioma')}>
        {(['en', 'pt'] as const).map(lang => <button type="button" key={lang}
          aria-pressed={lang === language} onClick={() => onLanguage(lang)}>{lang.toUpperCase()}</button>)}
      </div>
      <button type="button" className={styles.mobileLanguage} aria-label={t('Escolha um idioma')}
        onClick={() => onLanguage(language === 'en' ? 'pt' : 'en')}>{language.toUpperCase()}</button>
      <span className={styles.systemIcon} role="img" aria-label={t('Rede')} title={t('Rede')}><Win7Icon name="network" size={16} /></span>
      <span className={styles.systemIcon} role="img" aria-label={t('Central de Ações')} title={t('Central de Ações')}><Win7Icon name="notifications" size={16} /></span>
      <VolumeControl />
      <div className={styles.clock} title={clock.full}><time>{clock.time}</time><span>{clock.date}</span></div>
    </div>
    <button type="button" className={styles.showDesktop} data-show-desktop aria-label={t('Mostrar área de trabalho')} title={t('Mostrar área de trabalho')} onClick={onShowDesktop} />
  </footer>;
}
