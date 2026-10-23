'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { LanguageProvider, useT } from '@/src/shared/LanguageContext';
import type { Language } from '@/lib/locale-dictionary';
import { applications, type AppId } from './types';
import Win7Icon from './Win7Icon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import WindowManager from './WindowManager';
import { useWindowManager } from './useWindowManager';
import styles from './win7.module.css';
import type { PhotoSelection } from '@/src/lib/photos';
import Logon from './Logon';
import SoundManagerProvider, { useSoundManager } from './SoundManager';
import type { Win7Sound } from '@/src/lib/win7-sounds';
import DesktopSettingsProvider, { useDesktopSettings } from './DesktopSettings';
import { useDesktopSelection } from './useDesktopSelection';

export default function Win7Desktop({ availableSounds = [] }: { availableSounds?: Win7Sound[] }) {
  const [language, setLanguage] = useState<Language>('en');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('capimaso-xp-language');
      if (saved === 'en' || saved === 'pt') setLanguage(saved);
    } catch {}
  }, []);
  useEffect(() => { document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en'; }, [language]);

  function changeLanguage(next: Language) {
    setLanguage(next);
    try { localStorage.setItem('capimaso-xp-language', next); } catch {}
  }
  return <LanguageProvider language={language}><SoundManagerProvider available={availableSounds}>
    <Session onLanguage={changeLanguage} />
  </SoundManagerProvider></LanguageProvider>;
}

function Session({ onLanguage }: { onLanguage: (language: Language) => void }) {
  const [phase, setPhase] = useState<'logon' | 'loading' | 'desktop'>('logon');
  const sounds = useSoundManager();
  const t = useT();
  const loading = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (phase === 'logon') sounds.play('startup');
  }, [phase, sounds]);
  useEffect(() => {
    if (phase !== 'loading') return;
    loading.current?.focus({ preventScroll: true });
    const wallpaper = new Image();
    wallpaper.src = '/assets/win7/wallpapers/desktop-logo.jpg';
    const timer = window.setTimeout(() => setPhase('desktop'), 700);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (phase === 'loading') return <div ref={loading} className={styles.logonTransition} data-win7-loading
    role="status" aria-label={t('Carregando...')} aria-busy="true" tabIndex={-1} />;
  return phase === 'desktop' ? <DesktopSettingsProvider><Desktop onLanguage={onLanguage} /></DesktopSettingsProvider> : <Logon onLanguage={onLanguage} onEnter={() => {
    if (phase !== 'logon') return;
    sounds.enable(); sounds.play('logon'); setPhase('loading');
  }} />;
}

function Desktop({ onLanguage }: { onLanguage: (language: Language) => void }) {
  const t = useT();
  const { wallpaper } = useDesktopSettings();
  const [selected, setSelected] = useState<AppId[]>([]);
  const shortcuts = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLElement>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const selection = useDesktopSelection(root, workspace, shortcuts, setSelected);
  const manager = useWindowManager(workspace);
  const { state, dispatch, area, compact, activeId } = manager;
  const [startOpen, setStartOpen] = useState(false);
  const previousActive = useRef<AppId | undefined>(undefined);

  useEffect(() => {
    if (!activeId && previousActive.current) {
      const id = previousActive.current;
      const control = root.current?.querySelector<HTMLButtonElement>(`[data-task="${id}"]`)
        || root.current?.querySelector<HTMLButtonElement>(`[data-shortcut="${id}"]`)
        || root.current?.querySelector<HTMLButtonElement>('[data-start-button]');
      control?.focus({ preventScroll: true });
    }
    previousActive.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const keyboard = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && event.ctrlKey) {
        event.preventDefault(); setStartOpen(value => !value);
      } else if (event.key === 'Escape' && startOpen) {
        setStartOpen(false);
        root.current?.querySelector<HTMLButtonElement>('[data-start-button]')?.focus();
      }
    };
    document.addEventListener('keydown', keyboard);
    return () => document.removeEventListener('keydown', keyboard);
  }, [startOpen]);

  const open = useCallback((id: AppId) => {
    setStartOpen(false);
    manager.open(id);
  }, [manager.open]);

  const view = useCallback((selection: PhotoSelection) => {
    setStartOpen(false);
    manager.open('photoViewer', selection);
  }, [manager.open]);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'Enter') { event.preventDefault(); open(applications[index].id); return; }
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

  return <main ref={root} className={`win7 ${styles.desktop}`} aria-label={t('Área de trabalho Windows 7')}
    style={{ backgroundImage: `url('/assets/win7/wallpapers/${wallpaper}')` }}
    onPointerMove={selection.onPointerMove} onPointerUp={selection.onPointerUp}
    onPointerCancel={selection.onPointerCancel} onLostPointerCapture={selection.onLostPointerCapture}
    onPointerDown={event => {
      selection.onPointerDown(event);
      if (!(event.target as HTMLElement).closest('[data-start-menu], [data-start-button]')) setStartOpen(false);
    }}>
    <div className={styles.shortcuts} data-desktop-icons aria-label={t('Área de trabalho')}>
      {applications.map((app, index) => <button type="button" key={app.id} data-shortcut={app.id}
        ref={element => { shortcuts.current[index] = element; }}
        className={styles.shortcut} aria-pressed={selected.includes(app.id)}
        onClick={event => {
          setSelected(current => event.ctrlKey || event.metaKey
            ? current.includes(app.id) ? current.filter(id => id !== app.id) : [...current, app.id]
            : [app.id]);
          if (compact || window.matchMedia('(pointer: coarse)').matches) open(app.id);
        }}
        onDoubleClick={() => open(app.id)}
        onKeyDown={event => navigate(event, index)}>
        <Win7Icon name={app.id} size={48} /><span>{t(app.label)}</span>
      </button>)}
    </div>
    {selection.box && <div className={styles.selectionBox} style={selection.box} data-desktop-selection aria-hidden="true" />}
    <div ref={workspace} className={styles.workspace}>
      <WindowManager windows={state.windows} activeId={activeId} compact={compact} area={area}
        dispatch={dispatch} onOpen={open} onClose={manager.close} onView={view} />
    </div>
    <StartMenu open={startOpen} onOpen={open} onBrowse={folder => { setStartOpen(false); manager.browse(folder); }}
      onClose={() => { setStartOpen(false); root.current?.querySelector<HTMLButtonElement>('[data-start-button]')?.focus({ preventScroll: true }); }} />
    <Taskbar startOpen={startOpen} onStart={() => setStartOpen(value => !value)} windows={state.windows}
      activeId={activeId} onOpen={open} onTask={manager.task}
      onShowDesktop={manager.showDesktop} onLanguage={onLanguage} />
    <noscript><p className={styles.noScript}>{t('Ative o JavaScript para usar as janelas.')} <a href="/">{t('Voltar ao Boot Manager')}</a></p></noscript>
  </main>;
}
