'use client';

import { useState } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import { youtubePoster } from '@/lib/showcase';
import type { AppId } from '../types';
import { useMediaCatalog, type MediaSelection } from '../MediaCatalog';
import { useSoundManager } from '../SoundManager';
import Win7Icon from '../Win7Icon';
import LibrarySidebar from './LibrarySidebar';
import styles from '../win7.module.css';
import mediaStyles from './media.module.css';

type Folder = 'videos' | 'short' | 'long';
type Entry = { id: string; label: string; folder?: Folder; selection?: MediaSelection; poster?: string; portrait?: boolean };

export default function MediaExplorer({ id, onOpen, onMedia }: {
  id: 'videos' | 'thumbnails'; onOpen: (id: AppId) => void; onMedia: (selection: MediaSelection) => void;
}) {
  const t = useT();
  const sounds = useSoundManager();
  const { showcase, thumbnails } = useMediaCatalog();
  const [history, setHistory] = useState<Folder[]>(['videos']);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const folder = history[position];
  const title = id === 'thumbnails' ? 'Thumbnails' : folder === 'short' ? 'Vídeos curtos' : folder === 'long' ? 'Vídeos longos' : 'Vídeos';
  const entries: Entry[] = id === 'thumbnails'
    ? thumbnails.map(image => ({ id: image.src, label: image.name, poster: image.src, selection: { kind: 'thumbnail', src: image.src } }))
    : folder === 'videos' ? [
      { id: 'short', label: 'Vídeos curtos', folder: 'short' },
      { id: 'long', label: 'Vídeos longos', folder: 'long' },
    ] : showcase.filter(item => item.format === folder).map(item => ({ id: item.id, label: t(item.title),
      poster: item.thumbnail || youtubePoster(item.video) || undefined, portrait: item.format === 'short', selection: { kind: 'video', id: item.id } }));

  function navigate(next: Folder) {
    setHistory(current => [...current.slice(0, position + 1), next]);
    setPosition(position + 1); setSelected(null); sounds.play('navigation');
  }
  function step(delta: number) { setPosition(current => current + delta); setSelected(null); sounds.play('navigation'); }
  function activate(entry: Entry) {
    if (entry.folder) navigate(entry.folder);
    else if (entry.selection) onMedia(entry.selection);
  }

  return <div className={styles.explorer} data-media-explorer={id}>
    <div className={styles.photoAddressBar}>
      <div className={styles.historyButtons}>
        <button type="button" disabled={id === 'thumbnails' || position === 0} onClick={() => step(-1)} aria-label={t('Voltar')}>←</button>
        <button type="button" disabled={id === 'thumbnails' || position === history.length - 1} onClick={() => step(1)} aria-label={t('Avançar')}>→</button>
      </div>
      <div className={styles.addressField}><nav className={styles.breadcrumbs} aria-label={t('Endereço')}>
        <Win7Icon name={id} size={16} /><span>CAPIMASO</span><span aria-hidden="true">›</span>
        {id === 'videos' && folder !== 'videos' ? <>
          <button type="button" onClick={() => navigate('videos')}>{t('Vídeos')}</button><span aria-hidden="true">›</span>
        </> : null}
        <span aria-current="page">{t(title)}</span>
      </nav></div>
    </div>
    <div className={styles.explorerToolbar}><span>{t(title)}</span><span>{t('Bibliotecas')}</span></div>
    <div className={styles.explorerColumns}>
      <LibrarySidebar current={id} onOpen={onOpen} />
      <div className={`has-scrollbar ${styles.explorerBody}`}>
        <h1>{t(title)}</h1>
        <div className={`${styles.photosGrid} ${mediaStyles.grid}`}>
          {entries.map(entry => <button type="button" key={entry.id} data-media-item={entry.id}
            className={styles.photoEntry} aria-pressed={selected === entry.id} title={entry.label}
            onClick={event => {
              setSelected(entry.id);
              if (event.detail > 0 && (window.innerWidth < 720 || window.matchMedia('(pointer: coarse)').matches)) activate(entry);
            }} onDoubleClick={() => activate(entry)}
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(entry); } }}>
            {entry.folder ? <span className={styles.folderThumbnail}><Win7Icon name="folder" size={64} /></span>
              : <MediaPoster src={entry.poster} portrait={entry.portrait} />}
            <span>{entry.label}</span>
          </button>)}
        </div>
        {!entries.length && <p className={styles.emptyLibrary}>{t('Esta pasta está vazia.')}</p>}
      </div>
    </div>
    <footer className={styles.explorerStatus} role="status">{entries.length} {t('objeto(s)')}
      {selected && <span className={styles.selectedPhotoName}>{entries.find(entry => entry.id === selected)?.label}</span>}
    </footer>
  </div>;
}

export function MediaPoster({ src, portrait = false }: { src?: string; portrait?: boolean }) {
  const t = useT();
  const [failed, setFailed] = useState(false);
  return <span className={`${mediaStyles.poster} ${portrait ? mediaStyles.portrait : ''}`}>
    {src && !failed ? <img src={src} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />
      : <span className={styles.missingThumbnail}><Win7Icon name="thumbnails" size={32} /><small>{t('Prévia indisponível')}</small></span>}
  </span>;
}
