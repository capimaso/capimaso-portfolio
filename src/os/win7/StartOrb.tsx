'use client';

import { useT } from '@/src/shared/LanguageContext';
import styles from './win7.module.css';

export default function StartOrb({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const t = useT();
  return <button type="button" className={styles.startOrb} data-start-button aria-label={t('Iniciar')}
    aria-expanded={open} aria-controls="win7-start-menu" onClick={onToggle}>
    <span className={styles.orbSprite} aria-hidden="true" />
  </button>;
}
