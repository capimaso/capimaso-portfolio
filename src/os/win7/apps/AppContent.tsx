'use client';

import { useState } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import { profile } from '@/data/profile';
import { socials } from '@/data/socials';
import { applications, type AppId } from '../types';
import Win7Icon from '../Win7Icon';
import styles from '../win7.module.css';
import type { PhotoFolder, PhotoSelection } from '@/src/lib/photos';
import Explorer from './Explorer';
import PhotoViewer from './PhotoViewer';
import SystemTools from './SystemTools';

export default function AppContent({ id, onOpen, onView, selection, folder }: { id: AppId; onOpen: (id: AppId) => void; onView: (selection: PhotoSelection) => void; selection?: PhotoSelection; folder?: PhotoFolder[] }) {
  const t = useT();
  const [notice, setNotice] = useState('');
  if (id === 'calculator' || id === 'notepad') return <SystemTools id={id} />;
  if (id === 'photos') return <Explorer onOpen={onOpen} onView={onView} initialTrail={folder} />;
  if (id === 'photoViewer') return selection ? <PhotoViewer selection={selection} /> : null;
  if (id === 'about') return <article className={styles.about}>
    <header><img src="/images/profile.jpg" width={72} height={72} alt={profile.brand} /><div><h1>{profile.name} / {profile.brand}</h1><p>{t(profile.role)}</p></div></header>
    <p>{t(profile.bio)}</p><p>{t(profile.status)}</p>
  </article>;
  if (id === 'contact') return <section className={styles.contact}>
    <h1>{t('Contato')}</h1>
    {socials.map(social => <div className={styles.contactRow} key={social.id}>
      <div><strong>{t(social.name)}</strong><span>{social.value}</span></div>
      {social.href && <a href={social.href} target={social.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{t('Abrir')}</a>}
      <button type="button" onClick={async () => {
        try { await navigator.clipboard.writeText(social.value); setNotice(t('Contato copiado!')); }
        catch { setNotice(t('Selecione e copie o contato.')); }
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
        {id === 'games' && <><p>{t('Os jogos estarão disponíveis em uma próxima atualização.')}</p><div className={styles.gamesList}>
          {(['solitaire', 'purble'] as const).map(game => <div key={game} className={styles.gameItem}>
            <Win7Icon name={game} size={64} /><strong>{game === 'solitaire' ? 'Solitaire' : 'Purble Place'}</strong><span>{t('Em breve')}</span>
          </div>)}
        </div></>}
      </div>
    </div>
    <footer className={styles.explorerStatus}>CAPIMASO</footer>
  </div>;
}
