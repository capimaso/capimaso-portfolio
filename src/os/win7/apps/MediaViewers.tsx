'use client';

import { useState } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import { useMediaCatalog, type MediaSelection } from '../MediaCatalog';
import styles from './media.module.css';
import WmpPlayer from './WmpPlayer';

export function VideoPlayer({ id, onMedia }: { id?: string; onMedia: (selection: MediaSelection) => void }) {
  const t = useT();
  const { showcase, introduction } = useMediaCatalog();
  const item = showcase.find(item => item.id === id) || (introduction?.id === id ? introduction : undefined);
  if (!item) return <p className={styles.message}>{t('Selecione um vídeo na pasta Vídeos.')}</p>;
  return <WmpPlayer key={item.id} item={item} onMedia={onMedia} />;
}

export function ThumbnailViewer({ src, onMedia }: { src?: string; onMedia: (selection: MediaSelection) => void }) {
  const t = useT();
  const { thumbnails } = useMediaCatalog();
  const index = thumbnails.findIndex(image => image.src === src);
  const image = thumbnails[index];
  const [failed, setFailed] = useState(false);
  function step(delta: number) {
    const next = thumbnails[index + delta];
    if (next) onMedia({ kind: 'thumbnail', src: next.src });
  }
  if (!image) return <p className={styles.message}>{t('Selecione uma thumbnail.')}</p>;
  return <div className={styles.imageViewer} data-thumbnail-viewer tabIndex={0} onKeyDown={event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1); }
  }}>
    <div className={styles.imageStage}>{failed ? <p role="alert">{t('Prévia indisponível')}</p>
      : <img src={image.src} alt={image.name} onError={() => setFailed(true)} />}</div>
    <div className={styles.imageControls}>
      <button type="button" disabled={index <= 0} onClick={() => step(-1)}>{t('Anterior')}</button>
      <span>{image.name} · {index + 1}/{thumbnails.length}</span>
      <button type="button" disabled={index >= thumbnails.length - 1} onClick={() => step(1)}>{t('Próxima')}</button>
      <a href={image.src} download={image.name}>{t('Baixar')}</a>
    </div>
  </div>;
}
