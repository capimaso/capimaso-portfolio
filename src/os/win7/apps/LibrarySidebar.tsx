'use client';

import { useT } from '@/src/shared/LanguageContext';
import type { AppId } from '../types';
import Win7Icon from '../Win7Icon';
import styles from '../win7.module.css';

const places = [
  { id: 'images', label: 'Imagens' },
  { id: 'photos', label: 'Fotografias' },
  { id: 'videos', label: 'Vídeos' },
  { id: 'thumbnails', label: 'Thumbnails' },
  { id: 'about', label: 'Meu perfil' },
  { id: 'contact', label: 'Contato' },
] as const;

export default function LibrarySidebar({ current, onOpen }: { current: AppId; onOpen: (id: AppId) => void }) {
  const t = useT();
  return <nav className={`has-scrollbar ${styles.explorerSidebar}`} aria-label={t('Outros lugares')}>
    <strong>{t('Favoritos')}</strong>
    {places.map(place => <button type="button" key={place.id} aria-current={current === place.id ? 'page' : undefined}
      onClick={() => onOpen(place.id)}><Win7Icon name={place.id} size={16} />{t(place.label)}</button>)}
  </nav>;
}
