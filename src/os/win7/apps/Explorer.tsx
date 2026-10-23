'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage, useT } from '@/src/shared/LanguageContext';
import { photoImageURL, type PhotoFolder, type PhotoItem, type PhotoListing, type PhotoSelection } from '@/src/lib/photos';
import type { AppId } from '../types';
import Win7Icon from '../Win7Icon';
import { fetchPhotoListing, photoErrorMessage, type PhotoLocation } from './photo-client';
import styles from '../win7.module.css';

type Location = PhotoLocation & { trail: PhotoFolder[] };
type Props = { onOpen: (id: AppId) => void; onView: (selection: PhotoSelection) => void; initialTrail?: PhotoFolder[] };

function destination(trail: PhotoFolder[] = []): Location {
  return { id: trail.at(-1)?.id, path: trail.slice(0, -1).map(folder => folder.id), trail };
}

export default function Explorer({ onOpen, onView, initialTrail }: Props) {
  const t = useT(), language = useLanguage();
  const [history, setHistory] = useState<Location[]>(() => [destination(initialTrail)]);
  const lastDestination = useRef(initialTrail);
  const [position, setPosition] = useState(0);
  const [revision, setRevision] = useState(0);
  const [data, setData] = useState<PhotoListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const requests = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const location = history[position];

  useEffect(() => {
    if (lastDestination.current === initialTrail) return;
    lastDestination.current = initialTrail;
    setHistory([destination(initialTrail)]); setPosition(0); setRevision(0);
  }, [initialTrail]);

  useEffect(() => {
    const controller = new AbortController();
    requests.current = controller;
    const current = ++generation.current;
    setLoading(true); setMore(false); setError(null); setData(null); setSelected(null);
    fetchPhotoListing(location, { signal: controller.signal, refresh: revision > 0 })
      .then(result => { if (generation.current === current) setData(result); })
      .catch(failure => { if (!controller.signal.aborted && generation.current === current) setError(failure); })
      .finally(() => { if (generation.current === current) setLoading(false); });
    return () => controller.abort();
  }, [location, revision]);

  function navigate(next: Location) {
    setHistory(current => [...current.slice(0, position + 1), next]);
    setPosition(position + 1); setRevision(0);
  }
  function step(delta: number) { setPosition(value => value + delta); setRevision(0); }
  const trail = data?.breadcrumbs || location.trail;
  const items = [...(data?.items || [])].sort((a, b) => Number(b.kind === 'folder') - Number(a.kind === 'folder') || a.name.localeCompare(b.name, language, { numeric: true }));

  function activate(item: PhotoItem) {
    if (!data) return;
    if (item.kind === 'folder') navigate({ id: item.id, path: data.breadcrumbs.map(folder => folder.id), trail: [...data.breadcrumbs, { id: item.id, name: item.name }] });
    else {
      const images = items.filter(file => file.kind === 'image');
      onView({ images, index: images.findIndex(file => file.id === item.id), folder: data.folder,
        path: data.breadcrumbs.map(folder => folder.id), nextPageToken: data.nextPageToken });
    }
  }

  async function loadMore() {
    if (!data?.nextPageToken || more) return;
    const current = generation.current;
    setMore(true); setError(null);
    try {
      const result = await fetchPhotoListing(location, { token: data.nextPageToken, signal: requests.current?.signal });
      if (generation.current === current) setData(previous => previous ? { ...result,
        items: [...new Map([...previous.items, ...result.items].map(item => [item.id, item])).values()] } : result);
    } catch (failure) { if (!requests.current?.signal.aborted && generation.current === current) setError(failure); }
    finally { if (generation.current === current) setMore(false); }
  }

  return <div className={styles.explorer} data-photo-explorer>
    <div className={styles.photoAddressBar}>
      <div className={styles.historyButtons}>
        <button type="button" disabled={position === 0} onClick={() => step(-1)} aria-label={t('Voltar')} title={t('Voltar')}>←</button>
        <button type="button" disabled={position === history.length - 1} onClick={() => step(1)} aria-label={t('Avançar')} title={t('Avançar')}>→</button>
      </div>
      <div className={styles.addressField}>
      <nav className={styles.breadcrumbs} aria-label={t('Endereço')}>
        <Win7Icon name="photos" size={16} />
        {!trail.length && <span>{t('Fotografias')}</span>}
        {trail.map((folder, index) => <span key={folder.id}>
          {index > 0 && <span aria-hidden="true">›</span>}
          <button type="button" title={folder.name} aria-current={index === trail.length - 1 ? 'page' : undefined}
            onClick={() => navigate({ id: folder.id, path: trail.slice(0, index).map(parent => parent.id), trail: trail.slice(0, index + 1) })}>
            {index === 0 ? t('Fotografias') : folder.name}
          </button>
        </span>)}
      </nav>
      <button type="button" className={styles.refreshPhotos} onClick={() => setRevision(value => value + 1)} aria-label={t('Atualizar')} title={t('Atualizar')}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M12.8 5A5.4 5.4 0 1 0 13 10" fill="none" stroke="#3189b2" strokeWidth="1.7" /><path d="m9.5 5 3.8.5L13.8 2" fill="none" stroke="#42995e" strokeWidth="1.7" /></svg>
      </button>
      </div>
    </div>
    <div className={styles.explorerToolbar}><span>{t('Fotografias')}</span><span>{data?.folder.name || t('Bibliotecas')}</span></div>
    <div className={styles.explorerColumns}>
      <nav className={`has-scrollbar ${styles.explorerSidebar}`} aria-label={t('Outros lugares')}>
        <strong>{t('Favoritos')}</strong>
        <button type="button" onClick={() => navigate({ trail: [] })}><Win7Icon name="photos" size={16} />{t('Fotografias')}</button>
        <button type="button" onClick={() => onOpen('about')}><Win7Icon name="about" size={16} />{t('Sobre')}</button>
        <button type="button" onClick={() => onOpen('contact')}><Win7Icon name="contact" size={16} />{t('Contato')}</button>
        <button type="button" onClick={() => onOpen('games')}><Win7Icon name="games" size={16} />{t('Games')}</button>
      </nav>
      <div className={`has-scrollbar ${styles.explorerBody}`} aria-busy={loading || more}>
        <h1>{data?.folder.name || trail.at(-1)?.name || t('Fotografias')}</h1>
        {loading && <><p role="status">{t('Carregando fotografias...')}</p><div className={styles.photosGrid} aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <div key={index} className={styles.photoSkeleton} />)}</div></>}
        {error !== null && <div className={styles.photoError} role="alert"><p>{t(photoErrorMessage(error))}</p>
          <button type="button" onClick={() => data ? void loadMore() : setRevision(value => value + 1)}>{t('Tentar novamente')}</button>
        </div>}
        {!loading && data && <>
          <div className={styles.photosGrid}>
            {items.map(item => <button type="button" key={item.id} data-photo-item={item.id} data-kind={item.kind}
              className={styles.photoEntry} aria-pressed={selected === item.id} title={item.name}
              onClick={event => {
                setSelected(item.id);
                if (event.detail > 0 && (window.innerWidth < 720 || window.matchMedia('(pointer: coarse)').matches)) activate(item);
              }}
              onDoubleClick={() => activate(item)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); activate(item); } }}>
              <PhotoThumbnail item={item} path={data.breadcrumbs.map(folder => folder.id)} />
              <span>{item.name}</span>
            </button>)}
          </div>
          {!items.length && !data.nextPageToken && <p className={styles.emptyLibrary}>{t('Esta pasta está vazia.')}</p>}
          {data.nextPageToken && <button type="button" className={styles.morePhotos} disabled={more} onClick={() => void loadMore()}>{t(more ? 'Carregando...' : 'Carregar mais')}</button>}
        </>}
      </div>
    </div>
    <footer className={styles.explorerStatus} role="status">{loading ? t('Carregando...') : data ? `${data.items.length} ${t('objeto(s)')}${data.nextPageToken ? ` · ${t('Mais itens disponíveis')}` : ''}` : t('Fotografias')}
      {selected && <span className={styles.selectedPhotoName}>{items.find(item => item.id === selected)?.name}</span>}
    </footer>
  </div>;
}

function PhotoThumbnail({ item, path }: { item: PhotoItem; path: string[] }) {
  const t = useT();
  const [failed, setFailed] = useState(false);
  return item.kind === 'folder' ? <span className={styles.folderThumbnail}><Win7Icon name="folder" size={64} /></span>
    : <span className={styles.photoThumbnail}>{failed ? <span className={styles.missingThumbnail}><Win7Icon name="photoViewer" size={32} /><small>{t('Prévia indisponível')}</small></span>
      : <img src={photoImageURL(item.id, 'thumbnail', false, path)} alt="" loading="lazy" decoding="async" onError={() => setFailed(true)} />}</span>;
}
