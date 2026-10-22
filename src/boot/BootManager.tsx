'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import styles from './boot.module.css';

const systems = [
  { href: '/xp', name: 'Windows XP', label: 'Vídeos' },
  { href: '/win7', name: 'Windows 7', label: 'Fotos' },
] as const;

export default function BootManager({ enabled }: { enabled: boolean }) {
  const t = useT();
  const [selected, setSelected] = useState(0);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (enabled) links.current[0]?.focus();
  }, [enabled]);

  function navigate(event: KeyboardEvent<HTMLElement>) {
    let next: number;
    if (event.key === 'ArrowDown') next = (selected + 1) % systems.length;
    else if (event.key === 'ArrowUp') next = (selected + systems.length - 1) % systems.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = systems.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    links.current[next]?.focus();
  }

  return <section className={styles.manager}>
    <h1 className={styles.heading}>Windows Boot Manager</h1>
    <div className={styles.body}>
      <p>{t('Escolha um sistema operacional para iniciar:')}</p>
      <p className={styles.instructions}>{t('Use as setas para selecionar e pressione ENTER.')}</p>
      <nav className={styles.systems} aria-label={t('Escolher sistema')} onKeyDown={navigate}>
        {systems.map((system, index) => <a
          key={system.href}
          ref={element => { links.current[index] = element; }}
          href={system.href}
          className={selected === index ? styles.selected : undefined}
          onFocus={() => setSelected(index)}
        >{system.name}<span> — {t(system.label)}</span></a>)}
      </nav>
      <p className={styles.identity}>CAPIMASO / Tiago</p>
    </div>
    <footer className={styles.footer}>
      <span>↑ ↓ = {t('Selecionar')}</span>
      <span>ENTER = {t('Iniciar')}</span>
    </footer>
  </section>;
}
