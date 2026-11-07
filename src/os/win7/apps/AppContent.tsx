'use client';

import { useState } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import { win7Socials as socials } from '@/data/win7-socials';
import { applications, type AppId } from '../types';
import Win7Icon from '../Win7Icon';
import styles from '../win7.module.css';
import type { PhotoFolder, PhotoSelection } from '@/src/lib/photos';
import Explorer from './Explorer';
import PhotoViewer from './PhotoViewer';
import SystemTools from './SystemTools';
import { useSoundManager } from '../SoundManager';
import ControlPanel from './ControlPanel';
import type { MediaSelection } from '../MediaCatalog';
import MediaExplorer from './MediaExplorer';
import { ThumbnailViewer, VideoPlayer } from './MediaViewers';
import Profile from './Profile';

export default function AppContent({ id, onOpen, onView, selection, folder, media, onMedia }: { id: AppId; onOpen: (id: AppId) => void; onView: (selection: PhotoSelection) => void; selection?: PhotoSelection; folder?: PhotoFolder[]; media?: MediaSelection; onMedia: (selection: MediaSelection) => void }) {
  const t = useT();
  const sounds = useSoundManager();
  const [notice, setNotice] = useState('');
  if (id === 'images' || id === 'videos' || id === 'thumbnails') return <MediaExplorer id={id} onOpen={onOpen} onMedia={onMedia} />;
  if (id === 'videoPlayer') return <VideoPlayer id={media?.kind === 'video' ? media.id : undefined} onMedia={onMedia} />;
  if (id === 'thumbnailViewer') return <ThumbnailViewer key={media?.kind === 'thumbnail' ? media.src : ''} src={media?.kind === 'thumbnail' ? media.src : undefined} onMedia={onMedia} />;
  if (id === 'controlPanel') return <ControlPanel />;
  if (id === 'calculator' || id === 'notepad') return <SystemTools id={id} />;
  if (id === 'photos') return <Explorer onOpen={onOpen} onView={onView} initialTrail={folder} />;
  if (id === 'photoViewer') return selection ? <PhotoViewer selection={selection} /> : null;
  if (id === 'about') return <Profile onOpen={onOpen} onMedia={onMedia} />;
  if (id === 'contact') return <section className={styles.contact}>
    <h1>{t('Contato')}</h1>
    {socials.map(social => <div className={styles.contactRow} key={social.id}>
      <div><strong>{t(social.name)}</strong><span>{social.value}</span></div>
      {social.href && <a href={social.href} target={social.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{t('Abrir')}</a>}
      <button type="button" onClick={async () => {
        try { await navigator.clipboard.writeText(social.value); setNotice(t('Contato copiado!')); }
        catch { setNotice(t('Selecione e copie o contato.')); sounds.play('error'); }
      }}>{t('Copiar')}</button>
    </div>)}
    <p role="status">{notice}</p>
  </section>;

  return <div className={styles.explorer}>
    <div className={styles.addressBar}><Win7Icon name={id} size={16} /><span>{t('Meu computador')}</span><span aria-hidden="true">›</span><strong>{t(applications.find(app => app.id === id)!.label)}</strong></div>
    <div className={styles.explorerToolbar}><span>{t('Organizar')}</span><span>{t('Biblioteca de fotografias e pastas pessoais')}</span></div>
    <div className={styles.explorerColumns}>
      <nav className={styles.explorerSidebar} aria-label={t('Outros lugares')}>
        <strong>{t('Favoritos')}</strong>
        {applications.filter(app => app.id !== 'recycle').map(app => <button type="button" key={app.id} aria-current={id === app.id ? 'page' : undefined} onClick={() => onOpen(app.id)}><Win7Icon name={app.id} size={16} />{t(app.label)}</button>)}
      </nav>
      <div className={styles.explorerBody}>
        <h1>{t(applications.find(app => app.id === id)!.label)}</h1>
        {id === 'recycle' && <div className={styles.emptyLibrary}><Win7Icon name="recycle" size={64} /><p>{t('Lixeira vazia')}</p></div>}
      </div>
    </div>
    <footer className={styles.explorerStatus}>CAPIMASO</footer>
  </div>;
}
