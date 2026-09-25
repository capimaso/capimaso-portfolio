'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRef, type ComponentProps, type PointerEvent as ReactPointerEvent, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react';
import XPIcon from './XPIcon';
import { useLanguage } from '@/lib/i18n';

export type AppWindowProps = {
  id: string;
  title: string;
  icon?: ComponentProps<typeof XPIcon>['kind'];
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  mobile: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  children: ReactNode;
};

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
};

export default function Window({
  id, title, icon = 'program', open, minimized, maximized, x, y, width, height, zIndex, mobile,
  onClose, onMinimize, onMaximize, onFocus, onMove, children
}: AppWindowProps) {
  const { t } = useLanguage();
  const dragState = useRef<DragState | null>(null);
  const clampPosition = (nextX: number, nextY: number) => ({
    x: Math.max(8, Math.min(nextX, Math.max(8, window.innerWidth - width - 8))),
    y: Math.max(8, Math.min(nextY, Math.max(8, window.innerHeight - 42 - height - 8)))
  });

  const handleDragStart = (event: ReactPointerEvent<HTMLElement>) => {
    onFocus();
    if (mobile || maximized || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: x,
      originY: y
    };
  };

  const handleDragMove = (event: ReactPointerEvent<HTMLElement>) => {
    const current = dragState.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const next = clampPosition(
      current.originX + event.clientX - current.startX,
      current.originY + event.clientY - current.startY
    );
    onMove(next.x, next.y);
  };

  const handleDragEnd = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragState.current?.pointerId === event.pointerId) dragState.current = null;
  };

  return (
    <AnimatePresence>
      {open && !minimized && (
        <motion.section
          key={id}
          className={`os-window ${maximized ? 'os-window-maximized' : ''}`}
          style={{ zIndex, left: maximized ? 0 : x, top: maximized ? 0 : y, width: maximized ? '100%' : width, height: maximized ? '100%' : height }}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.14 }}
          onPointerDown={onFocus}
          role="dialog"
          aria-label={t(title)}
          aria-modal="false"
        >
          <header
            className="window-titlebar"
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            onDoubleClick={(event: ReactMouseEvent<HTMLElement>) => {
              if (event.target instanceof Element && event.target.closest('.window-controls')) return;
              onMaximize();
            }}
          >
            <div className="window-title"><XPIcon kind={icon} size={18} /><span>{t(title)}</span></div>
            <div className="window-controls" aria-label={t('Window controls')} onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => event.stopPropagation()} onDoubleClick={(event: ReactMouseEvent<HTMLDivElement>) => event.stopPropagation()}>
              <button type="button" className="window-control" aria-label={t('Minimize')} onClick={(e: ReactMouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onMinimize(); }}>_</button>
              <button type="button" className="window-control" aria-label={t(maximized ? 'Restore' : 'Maximize')} onClick={(e: ReactMouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onMaximize(); }}>{maximized ? '❐' : '□'}</button>
              <button type="button" className="window-control window-close" aria-label={t('Close')} onClick={(e: ReactMouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onClose(); }}>×</button>
            </div>
          </header>
          <div className="window-body">{children}</div>
          <footer className="window-statusbar"><span>{t('CAPIMASO SYSTEM')}</span><span>{maximized ? t('FULL SCREEN') : t('READY')}</span></footer>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
