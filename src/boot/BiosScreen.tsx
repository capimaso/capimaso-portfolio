'use client';

import { useT } from '@/src/shared/LanguageContext';
import styles from './boot.module.css';

export default function BiosScreen({ onSkip }: { onSkip: () => void }) {
  const t = useT();
  return <section className={styles.biosOverlay} aria-label={t('Inicialização BIOS')}>
    <div className={styles.biosContent}>
      <h1>CAPIMASO</h1>
      <p>{t('Sequência de inicialização')}</p>
      <p>Windows XP<br />Windows 7</p>
      <p>{t('Abrindo o Windows Boot Manager...')}</p>
      <button type="button" onClick={onSkip}>{t('Pular BIOS')}</button>
      <p className={styles.biosHint}>{t('Pressione uma tecla para continuar.')}</p>
    </div>
  </section>;
}
