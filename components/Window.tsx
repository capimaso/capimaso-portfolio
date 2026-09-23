'use client';

import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import type { ComponentProps, PointerEvent as ReactPointerEvent, ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import XPIcon from './XPIcon';

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

export default function Window({
  title, icon = 'program', open, minimized, maximized, x, y, width, height, zIndex, mobile,
  onClose, onMinimize, onMaximize, onFocus, onMove, children
}: AppWindowProps) {
  const dragControls = useDragControls();

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => {
    if (mobile || maximized) return;
    const nextX = Math.max(8, Math.min(x + info.offset.x, window.innerWidth - width - 8));
    const nextY = Math.max(8, Math.min(y + info.offset.y, window.innerHeight - height - 54));
    onMove(nextX, nextY);
  };

  return (
    <AnimatePresence>
      {open && !minimized && (
        <motion.section
          key={title}
          className={`os-window ${maximized ? 'os-window-maximized' : ''}`}
          style={{ zIndex, left: maximized ? 6 : x, top: maximized ? 6 : y, width: maximized ? undefined : width, height: maximized ? undefined : height }}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.14 }}
          drag={mobile || maximized ? false : true}
          dragListener={false}
          dragControls={dragControls}
          dragMomentum={false}
          dragElastic={0.05}
          onDragEnd={handleDragEnd}
          onPointerDown={onFocus}
          role="dialog"
          aria-label={title}
        >
          <header
            className="window-titlebar"
            onPointerDown={(event: ReactPointerEvent<HTMLElement>) => {
              onFocus();
              if (!mobile && !maximized) dragControls.start(event);
            }}
            onDoubleClick={onMaximize}
          >
            <div className="window-title">
              <XPIcon kind={icon} size={18} />
              <span>{title}</span>
            </div>
            <div className="window-controls" aria-label="Window controls" onPointerDown={(e: ReactPointerEvent<HTMLDivElement>) => e.stopPropagation()}>
              <button type="button" className="window-control" aria-label="Minimize" onClick={(e: ReactMouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onMinimize(); }}>_</button>
              <button type="button" className="window-control" aria-label="Maximize" onClick={(e: ReactMouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onMaximize(); }}>□</button>
              <button type="button" className="window-control window-close" aria-label="Close" onClick={(e: ReactMouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onClose(); }}>×</button>
            </div>
          </header>
          <div className="window-body">{children}</div>
          <footer className="window-statusbar"><span>CAPIMASO SYSTEM</span><span>READY</span></footer>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
