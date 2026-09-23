'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentProps, MouseEvent, MouseEvent as ReactMouseEvent } from 'react';
import type { Project } from '@/data/projects';
import type { WindowId, WindowState } from '@/lib/types';
import Window from './Window';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import Notifications, { type Notice } from './Notifications';
import XPIcon from './XPIcon';
import {
  AboutContent,
  ComputerContent,
  ContactContent,
  type ContentActions,
  PlayerContent,
  PropertiesContent,
  RecycleContent,
  ServicesContent,
  SkillsContent,
  WelcomeContent,
  WorkContent
} from './WindowContents';

const desktopIcons: Array<{ id: WindowId | 'portfolio'; label: string; icon: ComponentProps<typeof XPIcon>['kind']; title: string }> = [
  { id: 'computer', label: 'My Computer', icon: 'computer', title: 'My Computer' },
  { id: 'portfolio', label: 'My Portfolio', icon: 'program', title: 'CAPIMASO.EXE' },
  { id: 'work', label: 'My Work', icon: 'folder', title: 'My Work' },
  { id: 'about', label: 'About Me', icon: 'user', title: 'About Me' },
  { id: 'skills', label: 'Skills', icon: 'gear', title: 'Skills' },
  { id: 'services', label: 'Services', icon: 'service', title: 'Services' },
  { id: 'contact', label: 'Contact', icon: 'mail', title: 'Contact' },
  { id: 'recycle', label: 'Recycle Bin', icon: 'recycle', title: 'Recycle Bin' }
];

const initialWindows: WindowState[] = [
  { id: 'welcome', title: 'CAPIMASO.EXE', icon: 'program', open: true, minimized: false, maximized: false, zIndex: 30, x: 280, y: 125, width: 780, height: 560 },
  { id: 'computer', title: 'My Computer', icon: 'computer', open: false, minimized: false, maximized: false, zIndex: 10, x: 160, y: 100, width: 680, height: 500 },
  { id: 'work', title: 'My Work', icon: 'folder', open: false, minimized: false, maximized: false, zIndex: 10, x: 115, y: 70, width: 930, height: 690 },
  { id: 'about', title: 'ABOUT_ME.txt', icon: 'file', open: false, minimized: false, maximized: false, zIndex: 10, x: 330, y: 115, width: 650, height: 510 },
  { id: 'skills', title: 'SYSTEM PROPERTIES', icon: 'gear', open: false, minimized: false, maximized: false, zIndex: 10, x: 345, y: 100, width: 760, height: 560 },
  { id: 'services', title: 'CAPIMASO_SERVICES.EXE', icon: 'service', open: false, minimized: false, maximized: false, zIndex: 10, x: 240, y: 85, width: 800, height: 610 },
  { id: 'contact', title: 'OUTLOOK EXPRESS', icon: 'mail', open: false, minimized: false, maximized: false, zIndex: 10, x: 310, y: 120, width: 720, height: 510 },
  { id: 'recycle', title: 'Recycle Bin', icon: 'recycle', open: false, minimized: false, maximized: false, zIndex: 10, x: 430, y: 175, width: 500, height: 340 },
  { id: 'properties', title: 'Properties', icon: 'computer', open: false, minimized: false, maximized: false, zIndex: 10, x: 470, y: 190, width: 480, height: 340 },
  { id: 'player', title: 'Media Player', icon: 'video', open: false, minimized: false, maximized: false, zIndex: 10, x: 190, y: 100, width: 820, height: 560 }
];

export default function Desktop() {
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [startOpen, setStartOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [mobile, setMobile] = useState(false);
  const [clock, setClock] = useState(new Date());
  const noticeSeed = useRef(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [windows, setWindows] = useState<WindowState[]>(initialWindows);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 780px)');
    const set = () => setMobile(media.matches);
    set();
    media.addEventListener?.('change', set);
    return () => media.removeEventListener?.('change', set);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    const tick = () => {
      const elapsed = performance.now() - started;
      const progress = Math.min(100, Math.round((elapsed / 1200) * 100));
      setBootProgress(progress);
      if (progress < 100) frame = requestAnimationFrame(tick);
      else window.setTimeout(() => setBooting(false), 180);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const notify = useCallback((message: string) => {
    const id = ++noticeSeed.current;
    setNotices((items) => [...items.slice(-3), { id, message }]);
    window.setTimeout(() => {
      setNotices((items) => items.filter((item) => item.id !== id));
    }, 3300);
  }, [noticeSeed]);

  const bringToFront = useCallback((id: WindowId) => {
    setWindows((items) => {
      const top = Math.max(...items.map((item) => item.zIndex)) + 1;
      return items.map((item) => item.id === id ? { ...item, zIndex: top, minimized: false } : item);
    });
  }, []);

  const openWindow = useCallback((id: WindowId, payload?: Project) => {
    if (id === 'player' && payload) setSelectedProject(payload);
    setStartOpen(false);
    setContextMenu(null);
    setWindows((items) => {
      const top = Math.max(...items.map((item) => item.zIndex)) + 1;
      return items.map((item) => item.id === id ? { ...item, open: true, minimized: false, zIndex: top, maximized: mobile ? true : item.maximized } : item);
    });
    const labels: Record<WindowId, string> = {
      welcome: 'CAPIMASO.EXE opened.', computer: 'My Computer opened.', work: 'My Work opened.', about: 'ABOUT_ME.txt opened.',
      skills: 'System Properties opened.', services: 'CAPIMASO services loaded.', contact: 'Outlook Express opened.', recycle: 'Recycle Bin opened.', properties: 'Properties opened.', player: 'Project opened.'
    };
    notify(labels[id]);
  }, [mobile, notify]);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((items) => items.map((item) => item.id === id ? { ...item, open: false, minimized: false } : item));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((items) => items.map((item) => item.id === id ? { ...item, minimized: true } : item));
  }, []);

  const maximizeWindow = useCallback((id: WindowId) => {
    setWindows((items) => items.map((item) => item.id === id ? { ...item, maximized: !item.maximized } : item));
    bringToFront(id);
  }, [bringToFront]);

  const moveWindow = useCallback((id: WindowId, x: number, y: number) => {
    setWindows((items) => items.map((item) => item.id === id ? { ...item, x, y } : item));
  }, []);

  const taskClick = (id: WindowId) => {
    const item = windows.find((windowItem) => windowItem.id === id);
    if (!item) return;
    if (item.minimized) {
      bringToFront(id);
      return;
    }
    bringToFront(id);
  };

  const contextOpen = (event: MouseEvent) => {
    event.preventDefault();
    setStartOpen(false);
    setContextMenu({ x: Math.min(event.clientX, window.innerWidth - 190), y: Math.min(event.clientY, window.innerHeight - 190) });
  };

  const refresh = () => {
    setContextMenu(null);
    window.location.reload();
  };

  const actions: ContentActions = useMemo(() => ({ open: openWindow, notify }), [openWindow, notify]);

  const contentFor = (id: WindowId) => {
    switch (id) {
      case 'welcome': return <WelcomeContent actions={actions} />;
      case 'computer': return <ComputerContent actions={actions} />;
      case 'work': return <WorkContent actions={actions} />;
      case 'about': return <AboutContent />;
      case 'skills': return <SkillsContent />;
      case 'services': return <ServicesContent />;
      case 'contact': return <ContactContent actions={actions} />;
      case 'recycle': return <RecycleContent />;
      case 'properties': return <PropertiesContent />;
      case 'player': return <PlayerContent project={selectedProject ?? { id: 'showreel', filename: 'CAPIMASO_REEL.mp4', title: 'CAPIMASO REEL', category: 'SHOWREEL', description: 'Replace the placeholder with your real showreel.', software: ['Your software here'], thumbnail: '/images/project-motion.svg', video: '/videos/CAPIMASO_REEL.mp4' }} actions={actions} />;
    }
  };

  return <main className="desktop-shell" onContextMenu={contextOpen} onClick={() => { if (contextMenu) setContextMenu(null); }}>
    <div className="wallpaper" aria-hidden="true" />
    <div className="crt-overlay" aria-hidden="true" />

    {booting && <div className="boot-screen">
      <div className="boot-logo"><div className="boot-mark"><img src="/images/profile.jpg" alt="CAPIMASO" /></div><strong>CAPIMASO SYSTEM</strong><span>VIDEO EDITOR WORKSTATION</span></div>
      <div className="boot-terminal"><p>BIOS OK</p><p>MEMORY CHECK OK</p><p>MEDIA SUBSYSTEM READY</p><p>LOADING PORTFOLIO...</p></div>
      <div className="boot-progress"><div style={{ width: `${bootProgress}%` }} /></div>
      <div className="boot-bottom"><span>BUILD 200X</span><button type="button" onClick={() => setBooting(false)}>SKIP ›</button><span>{bootProgress}%</span></div>
    </div>}

    <section className="desktop-area" aria-label="CAPIMASO desktop">
      <div className="desktop-icons" role="navigation" aria-label="Desktop shortcuts">
        {desktopIcons.map((item, index) => <button
          type="button"
          key={item.id}
          className="desktop-icon"
          style={{ animationDelay: `${index * 35}ms` }}
          onClick={() => item.id === 'portfolio' ? openWindow('welcome') : openWindow(item.id)}
          onDoubleClick={() => notify(`${item.title} activated.`)}
        >
          <span className="desktop-icon-image"><XPIcon kind={item.icon} size={46} /></span>
          <span>{item.label}</span>
        </button>)}
      </div>

      {windows.map((item) => <Window
        key={item.id}
        id={item.id}
        title={item.title}
        icon={item.icon}
        open={item.open}
        minimized={item.minimized}
        maximized={item.maximized}
        x={item.x}
        y={item.y}
        width={item.width}
        height={item.height}
        zIndex={item.zIndex}
        mobile={mobile}
        onClose={() => closeWindow(item.id)}
        onMinimize={() => minimizeWindow(item.id)}
        onMaximize={() => maximizeWindow(item.id)}
        onFocus={() => bringToFront(item.id)}
        onMove={(x, y) => moveWindow(item.id, x, y)}
      >{contentFor(item.id)}</Window>)}
    </section>

    <StartMenu open={startOpen} onOpen={openWindow} />
    {contextMenu && <div className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }} onClick={(e: ReactMouseEvent<HTMLDivElement>) => e.stopPropagation()} role="menu">
      <button type="button" role="menuitem" onClick={() => openWindow('welcome')}>View</button>
      <button type="button" role="menuitem" onClick={() => notify('Icons sorted by name.')}>Sort Icons</button>
      <button type="button" role="menuitem" onClick={refresh}>Refresh</button>
      <div className="context-separator" />
      <button type="button" role="menuitem" onClick={() => notify('New file creation is intentionally disabled in the portfolio shell.')}>New</button>
      <button type="button" role="menuitem" onClick={() => openWindow('properties')}>Properties</button>
    </div>}

    <Taskbar windows={windows} startOpen={startOpen} onStart={() => setStartOpen((value) => !value)} onTaskClick={taskClick} />
    <Notifications notices={notices} />
  </main>;
}
