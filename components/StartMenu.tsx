'use client';

import type { ComponentProps } from 'react';
import XPIcon from './XPIcon';
import type { WindowId } from '@/lib/types';
import { useLanguage } from '@/lib/i18n';

const items: Array<{ id: WindowId; label: string; icon: ComponentProps<typeof XPIcon>['kind'] }> = [
  { id: 'welcome', label: 'Portfolio', icon: 'program' },
  { id: 'computer', label: 'My Computer', icon: 'computer' },
  { id: 'work', label: 'My Work', icon: 'folder' },
  { id: 'about', label: 'About Me', icon: 'user' },
  { id: 'skills', label: 'Skills', icon: 'gear' },
  { id: 'services', label: 'Services', icon: 'service' },
  { id: 'contact', label: 'Contact', icon: 'mail' }
];

export default function StartMenu({ open, onOpen }: { open: boolean; onOpen: (id: WindowId) => void }) {
  const { t } = useLanguage();
  if (!open) return null;
  return (
    <div className="start-menu" role="menu">
      <div className="start-menu-head">
        <div className="start-avatar"><XPIcon kind="start" size={36} /></div>
        <div><strong>CAPIMASO</strong><span>{t('VIDEO EDITOR')}</span></div>
      </div>
      <div className="start-body">
        <div className="start-links">
          {items.map((item) => (
            <button key={item.id} type="button" role="menuitem" onClick={() => onOpen(item.id)}>
              <XPIcon kind={item.icon} size={28} />
              <span>{t(item.label)}</span>
            </button>
          ))}
        </div>
        <aside className="start-status">
          <div className="status-box"><span className="online-dot" /><strong>{t('ONLINE')}</strong></div>
          <div className="status-copy">{t('AVAILABLE FOR WORK')}<br/>{t('FOR WORK')}</div>
          <div className="start-divider" />
          <div className="start-meta">CAPIMASO SYSTEM<br/>BUILD 200X<br/>{t('LOCAL PORTFOLIO')}</div>
        </aside>
      </div>
      <div className="start-footer"><span>◒ {t('ALL PROGRAMS')}</span><button type="button" onClick={() => window.location.reload()}>⏻ {t('Shutdown')}</button></div>
    </div>
  );
}
