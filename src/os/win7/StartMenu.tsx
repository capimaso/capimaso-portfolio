'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import { profile } from '@/data/profile';
import { windowApplications as applications, type AppId } from './types';
import type { PhotoFolder, PhotoItem } from '@/src/lib/photos';
import { normalizeSearch, searchPrograms } from './program-catalog';
import { useStartSearch } from './useStartSearch';
import { photoErrorMessage } from './apps/photo-client';
import Win7Icon from './Win7Icon';
import type { Win7IconName } from './assets';
import styles from './win7.module.css';

export default function StartMenu({ open, onOpen, onBrowse }: { open: boolean; onOpen: (id: AppId) => void; onBrowse: (trail: PhotoFolder[]) => void }) {
  const t = useT();
  const [search, setSearch] = useState('');
  const [allPrograms, setAllPrograms] = useState(false);
  const [previewIcon, setPreviewIcon] = useState<Win7IconName>('folder');
  const [showPreview, setShowPreview] = useState(false);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const input = useRef<HTMLInputElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const matching = searchPrograms(search, t, allPrograms);
  const remote = useStartSearch(open, search);
  const folders = search.trim() ? (remote.listing?.items || []).filter(item => item.kind === 'folder'
    && normalizeSearch(item.name).includes(normalizeSearch(search))) : [];

  function clearPreview() {
    clearTimeout(previewTimer.current);
    previewTimer.current = undefined;
    setShowPreview(false);
  }

  function preview(name: Win7IconName) {
    clearPreview();
    previewTimer.current = setTimeout(() => {
      previewTimer.current = undefined;
      setPreviewIcon(name);
      setShowPreview(true);
    }, 500);
  }

  const previewEvents = (name: Win7IconName) => ({
    onMouseEnter: () => preview(name), onMouseLeave: clearPreview,
    onFocus: () => preview(name), onBlur: clearPreview,
  });

  useEffect(() => {
    clearTimeout(previewTimer.current);
    setShowPreview(false);
    return () => { clearTimeout(previewTimer.current); };
  }, [open, search, allPrograms]);

  function browse(item: PhotoItem) {
    if (remote.listing) onBrowse([...remote.listing.breadcrumbs, { id: item.id, name: item.name }]);
  }

  useEffect(() => {
    if (open) { setSearch(''); setAllPrograms(false); input.current?.focus(); }
  }, [open]);

  function navigate(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.target === input.current && (matching.length || folders.length)) {
      event.preventDefault();
      if (matching.length) onOpen(matching[0].id); else browse(folders[0]);
      return;
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

  return <section id="win7-start-menu" className={`window glass active ${styles.startMenu}`} data-start-menu data-open={open} inert={!open}
    aria-hidden={!open} aria-label={t('Menu Iniciar')} onKeyDown={navigate} onMouseLeave={clearPreview}>
    <div className={styles.startLeft}>
      <div className={`has-scrollbar ${styles.programs}`} ref={results} aria-label={t('Programas')}>
        {search.trim() && matching.length > 0 && <p className={styles.searchHeading}>{t('Programas')}</p>}
        {matching.map(app => <button type="button" key={app.id} {...previewEvents(app.id)} onClick={() => onOpen(app.id)}>
          <Win7Icon name={app.id} /><span>{t(app.label)}</span>
        </button>)}
        {folders.length > 0 && <p className={styles.searchHeading}>{t('Pastas do Drive')}</p>}
        {folders.map(folder => <button type="button" key={folder.id} {...previewEvents('folder')} data-search-folder={folder.id} onClick={() => browse(folder)}>
          <Win7Icon name="folder" /><span>{folder.name}</span>
        </button>)}
        {search.trim() && remote.loading && <p className={styles.searchStatus} role="status">{t('Carregando pastas...')}</p>}
        {search.trim() && remote.error !== null && <div className={styles.searchStatus} role="status">
          <p>{t(photoErrorMessage(remote.error))}</p><button type="button" onClick={remote.retry}>{t('Tentar novamente')}</button>
        </div>}
        {search.trim() && remote.listing?.nextPageToken && <button type="button" disabled={remote.loading} onClick={() => void remote.loadMore()}>{t('Carregar mais')}</button>}
        {!matching.length && !folders.length && !remote.loading && remote.error === null && <p className={styles.noResults} role="status">{t('Nenhum item encontrado.')}</p>}
      </div>
      <button type="button" className={styles.allPrograms} {...previewEvents('folder')} aria-pressed={allPrograms} onClick={() => setAllPrograms(value => !value)}>
        <span aria-hidden="true">{allPrograms ? '◂' : '▸'}</span> {t(allPrograms ? 'Voltar' : 'Todos os programas')}
      </button>
      <div className={styles.searchBox}>
        <input ref={input} type="search" value={search} onChange={event => setSearch(event.target.value)}
          placeholder={t('Pesquisar programas e arquivos')} aria-label={t('Pesquisar programas e arquivos')} />
      </div>
    </div>
    <div className={styles.startRight}>
      <div className={styles.menuPortrait} data-start-preview={open && showPreview ? previewIcon : 'profile'}>
        <img className={styles.userPicture} src="/images/profile.jpg" alt={profile.brand} draggable={false} />
        <span className={styles.previewIcon} aria-hidden="true"><Win7Icon name={previewIcon} size={64} /></span>
      </div>
      <strong className={styles.userName}>{profile.name}</strong>
      {(['photos', 'games', 'about', 'contact', 'controlPanel'] as const).map(id => <button type="button" key={id} {...previewEvents(id)} onClick={() => onOpen(id)}>
        {t(applications.find(app => app.id === id)!.label)}
      </button>)}
      <div className={styles.startSeparator} />
      <Link href="/xp" className={styles.otherSystem}>Windows XP</Link>
      <Link href="/" className={styles.restart}>{t('Reiniciar')}</Link>
    </div>
  </section>;
}
