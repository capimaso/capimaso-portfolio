'use client';

import { useState } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import { desktopWallpapers, useDesktopSettings } from '../DesktopSettings';
import { useSoundManager, useSystemMuted } from '../SoundManager';
import Win7Icon from '../Win7Icon';
import shell from '../win7.module.css';
import styles from './control-panel.module.css';

type Page = 'home' | 'personalization' | 'sound';
const entries = [
  { id: 'personalization', label: 'Personalizar' },
  { id: 'sound', label: 'Som' },
] as const;

export default function ControlPanel() {
  const t = useT();
  const [page, setPage] = useState<Page>('home');
  const [forward, setForward] = useState<Exclude<Page, 'home'> | null>(null);
  const [query, setQuery] = useState('');
  const { wallpaper, setWallpaper } = useDesktopSettings();
  const sounds = useSoundManager();
  const muted = useSystemMuted();
  const title = page === 'home' ? 'Painel de controle' : entries.find(item => item.id === page)!.label;
  const goHome = () => { if (page !== 'home') setForward(page); setPage('home'); };

  return <section className={styles.panel} data-control-panel>
    <div className={shell.photoAddressBar}>
      <div className={shell.historyButtons}>
        <button type="button" aria-label={t('Voltar')} disabled={page === 'home'} onClick={goHome}>←</button>
        <button type="button" aria-label={t('Avançar')} disabled={page !== 'home' || !forward} onClick={() => { if (forward) setPage(forward); }}>→</button>
      </div>
      <nav className={shell.addressField} aria-label={t('Endereço')}>
        <div className={shell.breadcrumbs}>
          <Win7Icon name="controlPanel" size={16} />
          <button type="button" onClick={goHome}>{t('Painel de controle')}</button>
          {page !== 'home' && <><span aria-hidden="true">›</span><span aria-current="page">{t(title)}</span></>}
        </div>
      </nav>
      <input className={styles.search} type="search" aria-label={t('Pesquisar Painel de Controle')}
        placeholder={t('Pesquisar Painel de Controle')} value={query} onChange={event => { setQuery(event.target.value); goHome(); }} />
    </div>
    <header className={styles.heading}>
      <h1>{t(page === 'home' ? 'Ajuste as configurações do seu dispositivo' : title)}</h1>
      {page === 'home' && <span>{t('Exibir por:')} <strong>{t('Ícones grandes')}</strong></span>}
    </header>
    <div className={styles.content}>
      {page === 'home' && <div className={styles.grid}>
        {entries.filter(item => `${t(item.label)} ${item.label}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())).map(item =>
          <button type="button" key={item.id} className={styles.tile} onClick={() => { setForward(null); setPage(item.id); }}>
            <Win7Icon name={item.id} size={48} /><span>{t(item.label)}</span>
          </button>)}
        {query && !entries.some(item => `${t(item.label)} ${item.label}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
          && <p role="status">{t('Nenhum item encontrado.')}</p>}
      </div>}
      {page === 'personalization' && <section aria-label={t('Papel de parede')}>
        <h2>{t('Alterar plano de fundo')}</h2>
        <div className={styles.wallpapers}>
          {desktopWallpapers.map(file => <button type="button" key={file} className={styles.wallpaper}
            aria-pressed={wallpaper === file} onClick={() => setWallpaper(file)}>
            <img src={`/assets/win7/wallpapers/${file}`} alt="" width={180} height={112} />
            <span>{file === 'harmony.jpg' ? 'Windows 7 — Harmony' : 'Windows 7 — Desktop Logo'}</span>
          </button>)}
        </div>
        <p role="status">{t('Papel de parede')}: {wallpaper === 'harmony.jpg' ? 'Harmony' : 'Desktop Logo'}</p>
      </section>}
      {page === 'sound' && <section className={styles.sound} aria-label={t('Som')}>
        <Win7Icon name="sound" size={48} />
        <div><h2>{t('Sons do sistema')}</h2><p role="status">{t(muted ? 'O sistema está silenciado.' : 'Os sons do sistema estão ativados.')}</p>
          <button type="button" aria-pressed={muted} onClick={() => sounds.setMuted(!muted)}>{t(muted ? 'Ativar som' : 'Silenciar sistema')}</button>
        </div>
      </section>}
    </div>
  </section>;
}
