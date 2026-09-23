'use client';

import XPIcon from './XPIcon';
import type { WindowState } from '@/lib/types';

export default function Taskbar({
  windows,
  startOpen,
  onStart,
  onTaskClick
}: {
  windows: WindowState[];
  startOpen: boolean;
  onStart: () => void;
  onTaskClick: (id: WindowState['id']) => void;
}) {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const openWindows = windows.filter((item) => item.open);

  return (
    <footer className="taskbar" aria-label="System taskbar">
      <button type="button" className={`start-button ${startOpen ? 'pressed' : ''}`} onClick={onStart} aria-expanded={startOpen}>
        <span className="start-orb" aria-hidden="true"><XPIcon kind="start" size={25} /></span><span>START</span>
      </button>
      <div className="taskbar-divider" />
      <div className="taskbar-apps" aria-label="Open applications">
        {openWindows.map((item) => (
          <button key={item.id} type="button" className={`task-button ${item.minimized ? 'minimized' : ''}`} onClick={() => onTaskClick(item.id)}>
            <XPIcon kind="program" size={19} /><span>{item.title}</span>
          </button>
        ))}
      </div>
      <div className="system-tray">
        <span className="online-dot" title="System online" />
        <span className="tray-symbol">◆</span>
        <span className="tray-symbol">◈</span>
        <time dateTime={now.toISOString()}>{time}</time>
      </div>
    </footer>
  );
}
