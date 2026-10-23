'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import { photoImageURL, type PhotoSelection } from '@/src/lib/photos';
import { fetchPhotoListing, fetchPhotoOriginal, photoErrorMessage, PhotoRequestError } from './photo-client';
import styles from '../win7.module.css';

export default function PhotoViewer({ selection }: { selection: PhotoSelection }) {
  const t = useT();
  const [gallery, setGallery] = useState(selection);
  const [zoom, setZoom] = useState<number | null>(null);
  const [natural, setNatural] = useState({ width: 1, height: 1 });
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  const [original, setOriginal] = useState<{ source: string; url: string; blob: Blob } | null>(null);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [paging, setPaging] = useState(false);
  const [pageError, setPageError] = useState<unknown>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<unknown>(null);
  const stage = useRef<HTMLDivElement>(null);
  const requests = useRef<AbortController | null>(null);
  const downloadURLs = useRef(new Set<string>());
  const image = gallery.images[gallery.index];

  useEffect(() => {
    const controller = new AbortController();
    requests.current = controller;
    setGallery(selection); setPaging(false); setPageError(null); setDownloading(false); setDownloadError(null);
    return () => {
      controller.abort();
      for (const url of downloadURLs.current) URL.revokeObjectURL(url);
      downloadURLs.current.clear();
    };
  }, [selection]);

  const source = image ? photoImageURL(image.id, 'original', false, gallery.path) : '';
  useEffect(() => {
    const controller = new AbortController();
    let objectURL: string | undefined;
    setOriginal(null); setLoadError(null);
    if (image) void fetchPhotoOriginal(image.id, gallery.path, controller.signal).then(blob => {
      if (controller.signal.aborted) return;
      objectURL = URL.createObjectURL(blob);
      setOriginal({ source, url: objectURL, blob });
    }).catch(error => { if (!controller.signal.aborted) { setLoadError(error); setStatus('error'); } });
    setZoom(null); setStatus('loading'); setDownloadError(null);
    setNatural({ width: image?.width || 1, height: image?.height || 1 });
    stage.current?.scrollTo(0, 0);
    return () => { controller.abort(); if (objectURL) URL.revokeObjectURL(objectURL); };
  }, [source, retry]);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setSize({ width: element.clientWidth, height: element.clientHeight }));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const fit = Math.min(size.width / natural.width, size.height / natural.height, 1);
  const scale = zoom ?? fit;
  function changeZoom(factor: number) { setZoom(Math.min(8, Math.max(.05, scale * factor))); }
  function previous() {
    if (gallery.index > 0 && !paging) { setGallery(current => ({ ...current, index: current.index - 1 })); setPageError(null); }
  }
  async function next() {
    if (paging) return;
    setPageError(null);
    if (gallery.index + 1 < gallery.images.length) { setGallery(current => ({ ...current, index: current.index + 1 })); return; }
    if (!gallery.nextPageToken) return;
    const controller = requests.current;
    setPaging(true);
    try {
      let token: string | undefined = gallery.nextPageToken;
      let images = [...gallery.images];
      const seen = new Set<string>();
      while (token && images.length === gallery.images.length) {
        if (seen.has(token) || seen.size >= 100) throw new PhotoRequestError('unavailable');
        seen.add(token);
        const result = await fetchPhotoListing({ id: gallery.folder.id, path: gallery.path.slice(0, -1) }, { token, signal: controller?.signal });
        images = [...new Map([...images, ...result.items.filter(item => item.kind === 'image')].map(item => [item.id, item])).values()];
        token = result.nextPageToken;
      }
      if (!controller?.signal.aborted) setGallery(current => ({ ...current, images, nextPageToken: token,
        index: images.length > current.images.length ? current.index + 1 : current.index }));
    } catch (error) { if (!controller?.signal.aborted) setPageError(error); }
    finally { if (!controller?.signal.aborted) setPaging(false); }
  }

  async function download() {
    if (!image || downloading) return;
    const controller = requests.current;
    setDownloading(true); setDownloadError(null);
    try {
      let blob = original?.source === source ? original.blob : undefined;
      if (!blob) {
        blob = await fetchPhotoOriginal(image.id, gallery.path, controller?.signal, true);
      }
      if (controller?.signal.aborted) return;
      const url = URL.createObjectURL(blob);
      downloadURLs.current.add(url);
      const link = document.createElement('a');
      link.href = url; link.download = image.name;
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => { URL.revokeObjectURL(url); downloadURLs.current.delete(url); }, 60_000);
    } catch (error) { if (!controller?.signal.aborted) setDownloadError(error); }
    finally { if (!controller?.signal.aborted) setDownloading(false); }
  }

  function keyboard(event: KeyboardEvent) {
    if ((event.target as HTMLElement).closest('input,textarea')) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); previous(); }
    if (event.key === 'ArrowRight') { event.preventDefault(); void next(); }
    if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(1.25); }
    if (event.key === '-') { event.preventDefault(); changeZoom(.8); }
    if (event.key === '0') { event.preventDefault(); setZoom(null); }
  }

  if (!image) return null;
  return <div className={styles.photoViewer} data-photo-viewer data-current-photo={image.id} onKeyDown={keyboard}>
    <header className={styles.viewerHeading}><span>{image.name}</span><span aria-live="polite">{gallery.index + 1} / {gallery.images.length}{gallery.nextPageToken ? '+' : ''}</span></header>
    <div ref={stage} className={`has-scrollbar ${styles.viewerStage}`} tabIndex={0} aria-label={image.name}>
      <div className={styles.viewerCanvas} style={{ width: Math.max(size.width, natural.width * scale), height: Math.max(size.height, natural.height * scale) }}>
        {original?.source === source && <img key={`${image.id}:${retry}`} className={styles.viewerImage}
          src={original.url} data-original-src={source} alt={image.name} draggable={false}
          style={{ width: natural.width * scale, height: natural.height * scale, visibility: status === 'ready' ? 'visible' : 'hidden' }}
          onLoad={event => { setNatural({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight }); setStatus('ready'); }}
          onError={() => setStatus('error')} />}
      </div>
      {status === 'loading' && <p className={styles.viewerMessage} role="status">{t('Carregando fotografia...')}</p>}
      {status === 'error' && <div className={`${styles.viewerMessage} ${styles.photoError}`} role="alert"><p>{t(loadError ? photoErrorMessage(loadError) : 'Não foi possível abrir esta fotografia.')}</p><button type="button" onClick={() => setRetry(value => value + 1)}>{t('Tentar novamente')}</button></div>}
    </div>
    {(pageError !== null || downloadError !== null) && <div className={styles.viewerFailure} role="alert">
      <span>{t(photoErrorMessage(pageError || downloadError))}</span>
      <button type="button" onClick={() => pageError ? void next() : void download()}>{t('Tentar novamente')}</button>
    </div>}
    <footer className={styles.viewerControls}>
      <div className={styles.viewerNavigation}>
        <button type="button" className={styles.viewerPrevious} disabled={gallery.index === 0 || paging} aria-label={t('Anterior')} title={t('Anterior')} onClick={previous}>◀</button>
        <button type="button" className={styles.viewerNext} disabled={paging || (gallery.index === gallery.images.length - 1 && !gallery.nextPageToken)} aria-label={t('Próximo')} title={t('Próximo')} onClick={() => void next()}>▶</button>
      </div>
      <div className={styles.viewerZoom}>
        <button type="button" disabled={status !== 'ready' || scale <= .05} aria-label={t('Diminuir zoom')} title={t('Diminuir zoom')} onClick={() => changeZoom(.8)}>−</button>
        <output aria-label={t('Zoom')}>{Math.round(scale * 100)}%</output>
        <button type="button" disabled={status !== 'ready' || scale >= 8} aria-label={t('Aumentar zoom')} title={t('Aumentar zoom')} onClick={() => changeZoom(1.25)}>+</button>
        <button type="button" disabled={status !== 'ready'} aria-pressed={zoom === null} onClick={() => { setZoom(null); stage.current?.scrollTo(0, 0); }}>{t('Ajustar à janela')}</button>
      </div>
      <button type="button" className={styles.viewerDownload} disabled={downloading} onClick={() => void download()}>{t(downloading ? 'Baixando...' : 'Baixar')}</button>
    </footer>
  </div>;
}
