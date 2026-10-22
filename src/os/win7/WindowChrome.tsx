'use client';

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import { windowApplications as applications, type AppWindow, type Bounds, type WorkArea } from './types';
import Win7Icon from './Win7Icon';
import { fitBounds } from './window-state';
import styles from './win7.module.css';
import { useWindowGesture } from './useWindowGesture';
import type { ResizeDirection } from './window-geometry';

type Props = {
  window: AppWindow; active: boolean; compact: boolean; area: WorkArea; order: number;
  onFocus: () => void; onClose: () => void; onMinimize: () => void; onMaximize: () => void;
  onBounds: (bounds: Bounds) => void; children: ReactNode;
};

export default function WindowChrome({ window: win, active, compact, area, order, onFocus, onClose, onMinimize, onMaximize, onBounds, children }: Props) {
  const t = useT();
  const panel = useRef<HTMLElement>(null);
  const gesture = useWindowGesture(win, compact, area, onFocus, onBounds);
  const maximized = compact || win.maximized;
  const title = t(applications.find(app => app.id === win.id)!.label);

  useEffect(() => {
    if (active && !win.minimized && !panel.current?.contains(document.activeElement)) panel.current?.focus({ preventScroll: true });
  }, [active, win.minimized]);

  function keyboardMove(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || maximized || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const dx = event.key === 'ArrowLeft' ? -10 : event.key === 'ArrowRight' ? 10 : 0;
    const dy = event.key === 'ArrowUp' ? -10 : event.key === 'ArrowDown' ? 10 : 0;
    onBounds(fitBounds(event.shiftKey ? { ...win.bounds, width: win.bounds.width + dx, height: win.bounds.height + dy }
      : { ...win.bounds, x: win.bounds.x + dx, y: win.bounds.y + dy }, area));
  }

  return <section ref={panel} data-window={win.id} hidden={win.minimized} tabIndex={-1}
    role="dialog" aria-modal="false" aria-label={title} onPointerDown={onFocus} onFocus={event => { if (!event.currentTarget.contains(event.relatedTarget)) onFocus(); }}
    className={`window glass ${active ? 'active' : ''} ${styles.window} ${maximized ? styles.maximized : ''}`}
    style={{ left: maximized ? 0 : win.bounds.x, top: maximized ? 0 : win.bounds.y,
      width: maximized ? '100%' : win.bounds.width, height: maximized ? '100%' : win.bounds.height, zIndex: order + 1 }}>
    <div className={`title-bar ${styles.titlebar}`} tabIndex={0} aria-label={t('Setas movem a janela; Shift e setas redimensionam.')}
      onKeyDown={keyboardMove} onPointerDown={event => gesture.start(event)} {...gesture.handlers}
      onDoubleClick={event => { if (!compact && !(event.target as HTMLElement).closest('button')) onMaximize(); }}>
      <span className={`title-bar-text ${styles.windowTitle}`}><Win7Icon name={win.id} size={16} /><span>{title}</span></span>
      <div className={`title-bar-controls ${styles.windowButtons}`}>
        <button type="button" className="is-minimize" aria-label={t('Minimizar')} title={t('Minimizar')} onClick={onMinimize} />
        <button type="button" className={win.maximized ? 'is-restore' : 'is-maximize'} disabled={compact} aria-label={t(win.maximized ? 'Restaurar' : 'Maximizar')}
          title={t(win.maximized ? 'Restaurar' : 'Maximizar')} onClick={onMaximize} />
        <button type="button" className="is-close" aria-label={t('Fechar')} title={t('Fechar')} onClick={onClose} />
      </div>
    </div>
    <div className={`window-body ${styles.windowContent}`}>{children}</div>
    {!maximized && (['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as ResizeDirection[]).map(direction => <div
      key={direction} className={`${styles.resizeHandle} ${styles[direction]}`} data-resize={direction} aria-hidden="true"
      onPointerDown={event => gesture.start(event, direction)} {...gesture.handlers} />)}
  </section>;
}
