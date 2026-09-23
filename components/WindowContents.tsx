'use client';

import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import XPIcon from './XPIcon';
import type { Project } from '@/data/projects';
import { projects } from '@/data/projects';
import { profile } from '@/data/profile';
import { longFormPricing, services, shortPackages } from '@/data/services';
import { media } from '@/data/media';
import { socials } from '@/data/socials';
import { skills } from '@/data/skills';

export type ContentActions = {
  open: (id: 'welcome' | 'computer' | 'work' | 'about' | 'skills' | 'services' | 'contact' | 'recycle' | 'properties' | 'player', payload?: Project) => void;
  notify: (message: string) => void;
};

function Toolbar({ items }: { items: string[] }) {
  return <div className="classic-toolbar">{items.map((item) => <button key={item} type="button">{item}</button>)}</div>;
}

export function WelcomeContent({ actions }: { actions: ContentActions }) {
  return (
    <div className="welcome-content">
      <div className="welcome-topline"><span className="system-led" /> SYSTEM ONLINE <span className="topline-rule" /> CAPIMASO.EXE</div>
      <div className="welcome-main">
        <div className="brand-lockup">
          <div className="brand-mark">
            <img src="/images/profile.jpg" alt="CAPIMASO" />
          </div>
          <div>
            <p className="eyebrow">PERSONAL VIDEO WORKSTATION</p>
            <h1>{profile.brand}</h1>
            <p className="role">{profile.role}</p>
          </div>
        </div>
        <p className="tagline">{profile.tagline}</p>
        <p className="welcome-copy">A portfolio presented like an old computer: open the programs, browse the files, find the work.</p>
        <div className="xp-button-row">
          <button
            type="button"
            className="xp-button primary"
            onClick={() => actions.open('work')}
          >
            <span>▶</span> VIEW MY WORK
          </button>
        
          <button
            type="button"
            className="xp-button reel-button"
            onClick={() =>
              actions.open('player', {
                ...projects[0],
                id: 'showreel',
                filename: 'CAPIMASO_REEL.mp4',
                title: 'CAPIMASO REEL',
                category: 'SHOWREEL',
                description: 'ADD YOUR SHOWREEL DESCRIPTION HERE.',
                thumbnail: media.showreel.thumbnail,
                video: media.showreel.video
              })
            }
          >
            <span>▶</span> WATCH MY REEL
          </button>
        
          <button
            type="button"
            className="xp-button"
            onClick={() => actions.open('contact')}
          >
            <span>✉</span> CONTACT ME
          </button>
        </div>
      </div>
      <div className="welcome-strip">
        <div><span className="strip-label">STATUS</span><strong><span className="online-dot" /> {profile.status}</strong></div>
        <div><span className="strip-label">SYSTEM</span><strong>CAPIMASO / 200X</strong></div>
        <div><span className="strip-label">MEDIA</span><strong>VIDEO / DIGITAL</strong></div>
      </div>
    </div>
  );
}

export function ComputerContent({ actions }: { actions: ContentActions }) {
  const folders = [
    ['PORTFOLIO', 'program', 'My portfolio home'],
    ['WORK', 'folder', 'Video projects'],
    ['ABOUT', 'user', 'About CAPIMASO'],
    ['SKILLS', 'gear', 'Editing software'],
    ['SERVICES', 'service', 'Editing services'],
    ['CONTACT', 'mail', 'Get in touch']
  ] as const;
  const map: Record<string, Parameters<ContentActions['open']>[0]> = { PORTFOLIO: 'welcome', WORK: 'work', ABOUT: 'about', SKILLS: 'skills', SERVICES: 'services', CONTACT: 'contact' };

  return <div className="file-explorer">
    <Toolbar items={['File', 'Edit', 'View', 'Favorites', 'Tools', '?']} />
    <div className="addressbar"><span>Address</span><div className="address-field">C:\CAPIMASO\</div><button type="button" className="go-button">GO</button></div>
    <div className="explorer-content">
      <div className="side-pane">
        <div className="side-head">FILE TASKS</div>
        <button type="button" onClick={() => actions.open('work')}>Open Work</button>
        <button type="button" onClick={() => actions.open('contact')}>Contact CAPIMASO</button>
        <div className="side-rule" />
        <div className="side-head">OTHER PLACES</div>
        <span>MY COMPUTER</span><span>MY NETWORK</span>
      </div>
      <div className="folder-pane">
        {folders.map(([name, icon, desc]) => (
          <button key={name} type="button" className="file-item" onDoubleClick={() => actions.open(map[name])} onClick={() => actions.open(map[name])}>
            <XPIcon kind={icon} size={42} /><div><strong>{name}</strong><span>{desc}</span></div>
          </button>
        ))}
      </div>
    </div>
    <div className="explorer-status">6 object(s) &nbsp;|&nbsp; C:\CAPIMASO\</div>
  </div>;
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  return <article className="project-card">
    <button type="button" className="project-thumb" onClick={() => onOpen(project)} aria-label={`Open ${project.title}`}>
      <img src={project.thumbnail} alt="" loading="lazy" />
      <span className="thumb-play">▶</span>
    </button>
    <div className="project-meta">
      <div className="project-file"><XPIcon kind="video" size={22} /><span>{project.filename}</span></div>
      <span className="project-category">{project.category}</span>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="software-row">{project.software.map((item) => <span key={item}>{item}</span>)}</div>
      <button type="button" className="xp-button compact" onClick={() => onOpen(project)}>WATCH</button>
    </div>
  </article>;
}

function BeforeAfter() {
  const [split, setSplit] = useState(50);
  const ref = useRef<HTMLDivElement | null>(null);
  const update = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const value = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    setSplit(value);
  };
  return <section className="before-after">
    <div className="section-caption"><strong>RAW → FINAL</strong><span>INTERACTIVE COMPARISON</span></div>
    <div ref={ref} className="comparison" onPointerMove={(e: ReactPointerEvent<HTMLDivElement>) => e.buttons === 1 && update(e.clientX)} onPointerDown={(e: ReactPointerEvent<HTMLDivElement>) => update(e.clientX)}>
      <img src={media.beforeAfter.final} alt="Final edit comparison" />
      <div className="comparison-raw" style={{ width: `${split}%` }}><img src={media.beforeAfter.raw} alt="Raw footage comparison" /></div>
      <div className="comparison-handle" style={{ left: `${split}%` }}><span>↔</span></div>
    </div>
    <div className="comparison-labels"><span>RAW FOOTAGE</span><span>CAPIMASO EDIT</span></div>
  </section>;
}

export function WorkContent({ actions }: { actions: ContentActions }) {
  return <div className="work-browser">
    <Toolbar items={['File', 'Edit', 'View', 'Sort', 'Window']} />
    <div className="browser-head"><div><p className="eyebrow">C:\CAPIMASO\WORK\</p><h2>MY WORK</h2></div><span className="object-count">{projects.length} MEDIA FILES</span></div>
    <div className="projects-grid">{projects.map((project) => <ProjectCard key={project.id} project={project} onOpen={(item) => actions.open('player', item)} />)}</div>
    
  </div>;
}

export function PlayerContent({ project, actions }: { project: Project; actions: ContentActions }) {
  return <div className="player-window">
    <div className="player-header"><div className="player-file"><XPIcon kind="video" size={24} /><div><strong>{project.filename}</strong><span>{project.category} / {project.title}</span></div></div><span className="player-format">MP4</span></div>
    <div className="video-stage">
      <video controls preload="metadata" poster={project.thumbnail} src={project.video} className="native-video">
        Your browser does not support the video element.
      </video>
      <div className="video-fallback"><img src={project.thumbnail} alt="" /><div><strong>LOCAL MEDIA SLOT</strong><span>Replace {project.video} with your real video.</span></div></div>
    </div>
    <div className="player-info"><div><span>DESCRIPTION</span><p>{project.description}</p></div><div><span>SOFTWARE</span><p>{project.software.join(' / ')}</p></div></div>
    <div className="player-footer"><span>▶ PLAYBACK READY</span><button type="button" className="xp-button compact" onClick={() => actions.notify('Project opened successfully.')}>FILE → READY</button></div>
  </div>;
}

export function AboutContent() {
  return <div className="notepad">
    <Toolbar items={['File', 'Edit', 'Format', 'View', '?']} />
    <div className="notepad-ruler">Ln 1, Col 1 &nbsp;&nbsp;&nbsp; Windows Text Document &nbsp;&nbsp;&nbsp; UTF-8</div>
    <textarea aria-label="About me text" defaultValue={`CAPIMASO\nVIDEO EDITOR\n\n${profile.bio}`} />
  </div>;
}

export function SkillsContent() {
  return <div className="system-properties">
    <div className="properties-tabs"><span className="active">GENERAL</span><span>DETAILS</span><span>TOOLS</span></div>
    <div className="system-summary"><XPIcon kind="computer" size={62} /><div><strong>CAPIMASO SYSTEM</strong><span>VIDEO EDITING WORKSTATION</span><small>Tools currently listed in the portfolio.</small></div></div>
    <div className="skills-list">{skills.map((skill) => <div key={skill.name} className="skill-row"><XPIcon kind="program" size={34} /><div className="skill-main"><strong>{skill.name}</strong><span>{skill.category} · {skill.description}</span></div><span className="skill-specialty">{skill.specialty}</span></div>)}</div>
  </div>;
}

export function ServicesContent() {
  return <div className="services-app">
    <div className="services-hero">
      <div><p className="eyebrow">CAPIMASO_SERVICES.EXE</p><h2>EDITING SERVICES</h2></div>
      <span className="service-status"><span className="online-dot" /> AVAILABLE</span>
    </div>
    <div className="services-grid">{services.map((service) => <div className="service-row" key={service.id}><XPIcon kind="service" size={36} /><div><strong>{service.name}</strong><span>{service.description}</span></div><b>{service.price}</b></div>)}</div>

    <div className="packages">
      <div className="section-caption"><strong>SHORT FORM PACKAGES</strong><span>UP TO 60s</span></div>
      <div className="package-grid short-packages-grid">
        {shortPackages.map((item) => <div key={item.name} className="package-card">
          <strong>{item.name}</strong>
          <span>{item.price}</span>
          {item.unitPrice && <small>{item.unitPrice}</small>}
          <small>{item.benefits}</small>
          <small>DEADLINE: {item.turnaround}</small>
          <small>REVISIONS: {item.revisions}</small>
        </div>)}
      </div>
      <p className="pricing-note">Values for short videos up to 60 seconds. Prices may vary for longer videos.</p>
    </div>

    <div className="long-form-box">
      <div>
        <span className="strip-label">LONG FORM</span>
        <strong>{longFormPricing.startingPrice}</strong>
        <p>{longFormPricing.note}</p>
      </div>
      <span className="custom-quote-tag">CUSTOM QUOTE</span>
    </div>
  </div>;
}

export function ContactContent({ actions }: { actions: ContentActions }) {
  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value); actions.notify('DATA COPIED TO CLIPBOARD'); }
    catch { actions.notify('Clipboard unavailable. Copy it manually.'); }
  };
  const openSocial = (href: string, value: string) => {
    if (value.includes('YOUR_')) { actions.notify('Replace this placeholder in data/socials.ts first.'); return; }
    if (href.startsWith('mailto:')) window.location.href = href; else window.open(href, '_blank', 'noopener,noreferrer');
  };
  return <div className="outlook">
    <div className="outlook-brand"><div className="mail-logo"><XPIcon kind="mail" size={42} /></div><div><strong>OUTLOOK EXPRESS</strong><span>CAPIMASO MAILBOX</span></div></div>
    <div className="outlook-banner"><span>LET'S WORK TOGETHER</span><small>For projects, availability and editing requests.</small></div>
    <div className="contact-list">{socials.map((social) => <div className="contact-row" key={social.id}><div className="contact-label"><XPIcon kind="mail" size={26} /><strong>{social.name}</strong></div><code>{social.value}</code><div className="contact-actions"><button type="button" className="xp-button compact" onClick={() => openSocial(social.href, social.value)}>OPEN</button>{social.copyable && <button type="button" className="xp-button compact" onClick={() => copy(social.value)}>COPY</button>}</div></div>)}</div>
  </div>;
}

export function RecycleContent() {
  return <div className="recycle-content"><XPIcon kind="recycle" size={70} /><div><h2>RECYCLE BIN</h2><p>Nothing interesting here.</p><span>0 objects</span></div><div className="recycle-joke">Maybe later.</div></div>;
}

export function PropertiesContent() {
  return <div className="properties-dialog"><XPIcon kind="computer" size={70} /><div><h2>CAPIMASO SYSTEM</h2><p>Personal video editing portfolio running locally in your browser.</p><div className="property-line"><span>System</span><strong>CAPIMASO.EXE</strong></div><div className="property-line"><span>Mode</span><strong>PORTFOLIO</strong></div><div className="property-line"><span>Media</span><strong>LOCAL ASSETS</strong></div></div></div>;
}
