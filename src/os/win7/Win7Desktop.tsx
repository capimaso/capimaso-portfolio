'use client';

import { useCallback, useEffect, useReducer, useRef, useState, type KeyboardEvent } from 'react';
import { LanguageProvider, useT } from '@/src/shared/LanguageContext';
import type { Language } from '@/lib/locale-dictionary';
import { applications, type AppId } from './types';
import Win7Icon from './Win7Icon';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import WindowManager from './WindowManager';
import { activeWindow, initialWindows, windowReducer } from './window-state';
import styles from './win7.module.css';
import type { PhotoSelection } from '@/src/lib/photos';

export default function Win7Desktop() {
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
  return <LanguageProvider language={language}><Desktop onLanguage={changeLanguage} /></LanguageProvider>;
}

function Desktop({ onLanguage }: { onLanguage: (language: Language) => void }) {
  const t = useT();
  const [selected, setSelected] = useState<AppId[]>([]);
  const shortcuts = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLElement>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(windowReducer, initialWindows);
  const [area, setArea] = useState({ width: 1024, height: 728 });
  const [compact, setCompact] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const activeId = activeWindow(state.windows);

  useEffect(() => {
    const element = workspace.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const next = { width: element.clientWidth, height: element.clientHeight };
      if (!next.width || !next.height) return;
      setArea(next);
      setCompact(next.width < 720);
      // Mobile uses a fullscreen view; leave desktop bounds intact.
      if (next.width >= 720) dispatch({ type: 'fit', area: next });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

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
    dispatch({ type: 'open', id, area });
  }, [area]);

  const view = useCallback((selection: PhotoSelection) => {
    setStartOpen(false);
    dispatch({ type: 'open', id: 'photoViewer', area, selection });
  }, [area]);

  function close(id: AppId) {
    dispatch({ type: 'close', id });
    requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>(`[data-shortcut="${id}"]`)?.focus());
  }

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

  return <main ref={root} className={styles.desktop} aria-label={t('Área de trabalho Windows 7')}
    onPointerDown={event => {
      if (!(event.target as HTMLElement).closest('[data-shortcut]')) setSelected([]);
      if (!(event.target as HTMLElement).closest('[data-start-menu], [data-start-button]')) setStartOpen(false);
    }}>
    <div className={styles.shortcuts} aria-label={t('Área de trabalho')}>
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
    <div ref={workspace} className={styles.workspace}>
      <WindowManager windows={state.windows} activeId={activeId} compact={compact} area={area}
        dispatch={dispatch} onOpen={open} onClose={close} onView={view} />
    </div>
    <StartMenu open={startOpen} onOpen={open} />
    <Taskbar startOpen={startOpen} onStart={() => setStartOpen(value => !value)} windows={state.windows}
      activeId={activeId} onOpen={open} onTask={id => dispatch({ type: 'task', id })}
      onShowDesktop={() => dispatch({ type: 'desktop' })} onLanguage={onLanguage} />
    <noscript><p className={styles.noScript}>{t('Ative o JavaScript para usar as janelas.')} <a href="/">{t('Voltar ao Boot Manager')}</a></p></noscript>
  </main>;
}
