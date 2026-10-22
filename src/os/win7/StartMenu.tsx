'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import { profile } from '@/data/profile';
import { applications, windowApplications, type AppId } from './types';
import Win7Icon from './Win7Icon';
import styles from './win7.module.css';

export default function StartMenu({ onOpen }: { onOpen: (id: AppId) => void }) {
  const t = useT();
  const [search, setSearch] = useState('');
  const [allPrograms, setAllPrograms] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const catalog = windowApplications.filter(app => app.id !== 'photoViewer');
  const matching = catalog.filter(app => (allPrograms || search.trim() || applications.some(item => item.id === app.id && item.id !== 'recycle'))
    && normalize(`${t(app.label)} ${app.label} ${app.id} ${app.id === 'photos' ? 'fotos photos pictures imagens bibliotecas libraries' : ''} ${app.id === 'notepad' ? 'notepad notas texto text' : ''}`)
      .includes(normalize(search.trim())));

  useEffect(() => { input.current?.focus(); }, []);

  function navigate(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.target === input.current && matching.length) {
      event.preventDefault(); onOpen(matching[0].id); return;
    }
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const buttons = Array.from(results.current?.querySelectorAll<HTMLButtonElement>('button') || []);
    if (!buttons.length) return;
    event.preventDefault();
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next = index < 0 ? event.key === 'ArrowDown' ? 0 : buttons.length - 1
      : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
  }

  return <section id="win7-start-menu" className={styles.startMenu} data-start-menu aria-label={t('Menu Iniciar')} onKeyDown={navigate}>
    <div className={styles.startLeft}>
      <div className={styles.programs} ref={results} aria-label={t('Programas')}>
        {matching.map(app => <button type="button" key={app.id} onClick={() => onOpen(app.id)}>
          <Win7Icon name={app.id} /><span>{t(app.label)}</span>
        </button>)}
        {!matching.length && <p className={styles.noResults} role="status">{t('Nenhum item encontrado.')}</p>}
      </div>
      <button type="button" className={styles.allPrograms} aria-pressed={allPrograms} onClick={() => setAllPrograms(value => !value)}>
        <span aria-hidden="true">{allPrograms ? '◂' : '▸'}</span> {t(allPrograms ? 'Voltar' : 'Todos os programas')}
      </button>
      <div className={styles.searchBox}>
        <input ref={input} type="search" value={search} onChange={event => setSearch(event.target.value)}
          placeholder={t('Pesquisar programas e arquivos')} aria-label={t('Pesquisar programas e arquivos')} />
      </div>
    </div>
    <div className={styles.startRight}>
      <img className={styles.userPicture} src="/images/profile.jpg" alt={profile.brand} draggable={false} />
      <strong className={styles.userName}>{profile.name}</strong>
      {(['photos', 'games', 'about', 'contact'] as const).map(id => <button type="button" key={id} onClick={() => onOpen(id)}>
        {t(applications.find(app => app.id === id)!.label)}
      </button>)}
      <div className={styles.startSeparator} />
      <Link href="/xp" className={styles.otherSystem}>Windows XP</Link>
      <Link href="/" className={styles.restart}>{t('Reiniciar')}</Link>
    </div>
  </section>;
}
