'use client';

import { useState } from 'react';
import XPIcon from './XPIcon';
import type { Project } from '@/data/projects';
import { projects } from '@/data/projects';
import { profile } from '@/data/profile';
import { longFormPricing, services, shortPackages } from '@/data/services';
import { media } from '@/data/media';
import { socials } from '@/data/socials';
import { skills } from '@/data/skills';
import { useLanguage } from '@/lib/i18n';
export type ContentActions = {
  open: (id: 'welcome' | 'computer' | 'work' | 'about' | 'skills' | 'services' | 'contact' | 'recycle' | 'properties' | 'player', payload?: Project) => void;
  notify: (message: string) => void;
};

function Toolbar({ items }: { items: string[] }) {
  const { t } = useLanguage();
  return <div className="classic-toolbar">{items.map((item) => <button key={item} type="button">{t(item)}</button>)}</div>;
}
function getYouTubeVideoId(url: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1).split('/')[0] || null;
    if (parsed.hostname.includes('youtube.com')) {
      const queryId = parsed.searchParams.get('v');
      if (queryId) return queryId;
      const match = parsed.pathname.match(/\/(?:shorts|embed|live)\/([^/?]+)/);
      return match?.[1] ?? null;
    }
  } catch {
    return null;
  }
  return null;
}
function getYouTubeStartSeconds(url: string) {
  try {
    const value = new URL(url).searchParams.get('t');
    if (!value) return 0;
    if (/^\d+$/.test(value)) return Number(value);
    const match = value.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
    if (!match) return 0;
    return Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0);
  } catch {
    return 0;
  }
}
function getYouTubeEmbedUrl(url: string) {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  const start = getYouTubeStartSeconds(url);
  const params = new URLSearchParams({ rel: '0', modestbranding: '1' });
  if (start > 0) params.set('start', String(start));
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

function getYouTubeThumbnail(url: string) {
  const id = getYouTubeVideoId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : undefined;
}
function getInstagramEmbedUrl(url: string) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (hostname !== 'instagram.com') return null;

    const match = parsed.pathname.match(/\/(?:[^/]+\/)?(reel|p|tv)\/([^/?#]+)\/?$/i);
    if (!match) return null;
    const kind = match[1].toLowerCase();
    const id = match[2];
    return `https://www.instagram.com/${kind}/${id}/embed/`;
  } catch {
    return null;
  }
}
export function WelcomeContent({ actions }: { actions: ContentActions }) {
  const { t } = useLanguage();
  return (
    <div className="welcome-content">
      <div className="welcome-topline"><span className="system-led" /> {t('SYSTEM ONLINE')} <span className="topline-rule" /> CAPIMASO.EXE</div>
      <div className="welcome-main">
        <div className="brand-lockup">
          <div className="brand-mark"><img src="/images/profile.jpg" alt="CAPIMASO" /></div>
          <div>
            <p className="eyebrow">{t('PERSONAL VIDEO WORKSTATION')}</p>
            <h1>{profile.brand}</h1>
            <p className="role">{t(profile.role)}</p>
          </div>
        </div>
        <p className="tagline">{t(profile.tagline)}</p>
        <p className="welcome-copy">{t('A portfolio presented like an old computer: open the programs, browse the files, find the work.')}</p>
        <div className="xp-button-row">
          <button type="button" className="xp-button primary" onClick={() => actions.open('work')}>
            <span>▶</span> {t('VIEW MY WORK')}
          </button>
          <button
            type="button"
            className="xp-button reel-button"
            onClick={() => actions.open('player', {
              ...projects[0],
              id: 'showreel',
              filename: 'CAPIMASO_REEL',
              title: 'CAPIMASO REEL',
              category: 'SHOWREEL',
              description: 'Replace the placeholder with your real showreel.',
              thumbnail: media.showreel.thumbnail,
              video: media.showreel.video,
              format: 'long',
              platform: 'youtube'
            })}
          >
            <span>▶</span> {t('WATCH MY REEL')}
          </button>
          <button type="button" className="xp-button" onClick={() => actions.open('contact')}>
            <span>✉</span> {t('CONTACT ME')}
          </button>
        </div>
      </div>
      <div className="welcome-strip">
        <div><span className="strip-label">{t('STATUS')}</span><strong><span className="online-dot" /> {t(profile.status)}</strong></div>
        <div><span className="strip-label">{t('SYSTEM')}</span><strong>CAPIMASO / 200X</strong></div>
        <div><span className="strip-label">{t('MEDIA')}</span><strong>{t('VIDEO / DIGITAL')}</strong></div>
      </div>
    </div>
  );
}
export function ComputerContent({ actions }: { actions: ContentActions }) {
  const { t } = useLanguage();
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
    <div className="addressbar"><span>{t('Address')}</span><div className="address-field">C:\CAPIMASO\</div><button type="button" className="go-button">{t('GO')}</button></div>
    <div className="explorer-content">
      <div className="side-pane">
        <div className="side-head">{t('FILE TASKS')}</div>
        <button type="button" onClick={() => actions.open('work')}>{t('Open Work')}</button>
        <button type="button" onClick={() => actions.open('contact')}>{t('Contact CAPIMASO')}</button>
        <div className="side-rule" />
        <div className="side-head">{t('OTHER PLACES')}</div>
        <span>{t('My Computer')}</span><span>{t('MY NETWORK')}</span>
      </div>
      <div className="folder-pane">
        {folders.map(([name, icon, desc]) => (
          <button key={name} type="button" className="file-item" onDoubleClick={() => actions.open(map[name])} onClick={() => actions.open(map[name])}>
            <XPIcon kind={icon} size={42} /><div><strong>{t(name === 'PORTFOLIO' ? 'Portfolio' : name === 'WORK' ? 'My Work' : name === 'ABOUT' ? 'About Me' : name === 'SKILLS' ? 'Skills' : name === 'SERVICES' ? 'Services' : 'Contact')}</strong><span>{t(desc)}</span></div>
          </button>
        ))}
      </div>
    </div>
    <div className="explorer-status">6 {t('objects')} &nbsp;|&nbsp; C:\CAPIMASO\</div>
  </div>;
}
function ProjectCard({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  const { t } = useLanguage();
  const thumbnail = project.thumbnail ?? (project.platform === 'youtube' ? getYouTubeThumbnail(project.video) : undefined);
  const platformLabel = project.platform === 'instagram'
    ? t('Instagram Reel')
    : project.format === 'short'
      ? t('YouTube Short')
      : t('YouTube Video');
  return <article className={`project-card ${project.format === 'short' ? 'short-card' : 'long-card'} ${project.platform === 'instagram' ? 'instagram-card' : 'youtube-card'}`}>
    <button type="button" className="project-thumb" onClick={() => onOpen(project)} aria-label={`${t('OPEN')} ${t(project.title)}`}>
      {thumbnail ? <img src={thumbnail} alt="" loading="lazy" /> : <div className="project-no-thumb"><XPIcon kind="video" size={42} /><span>{t(project.platform === 'instagram' ? 'ADD AN INSTAGRAM THUMBNAIL' : 'ADD A YOUTUBE VIDEO')}</span></div>}
      <span className="thumb-platform">{project.platform === 'instagram' ? 'IG' : 'YT'}</span>
      <span className="thumb-play">▶</span>
    </button>
    <div className="project-meta">
      <div className="project-file"><XPIcon kind="video" size={22} /><span>{platformLabel}</span></div>
      <span className="project-category">{t(project.category)}</span>
      <h3>{t(project.title)}</h3>
      <p>{t(project.description)}</p>
      <div className="software-row">{project.software.map((item) => <span key={item}>{item}</span>)}</div>
      <button type="button" className="xp-button compact" onClick={() => onOpen(project)}>{t('WATCH')}</button>
    </div>
  </article>;
}
export function WorkContent({ actions }: { actions: ContentActions }) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'short' | 'long'>('short');
  const visibleProjects = projects.filter((project) => project.format === tab);
  return <div className="work-browser">
    <Toolbar items={['File', 'Edit', 'View', 'Sort', 'Window']} />
    <div className="browser-head">
      <div><p className="eyebrow">C:\CAPIMASO\WORK\</p><h2>{t('MY WORK')}</h2></div>
      <span className="object-count">{visibleProjects.length} {visibleProjects.length === 1 ? t('MEDIA FILE') : t('MEDIA FILES')}</span>
    </div>
    <div className="work-tabs" role="tablist" aria-label={t('Work folders')}>
      <button type="button" className={`work-tab ${tab === 'short' ? 'active' : ''}`} onClick={() => setTab('short')} role="tab" aria-selected={tab === 'short'}>
        <XPIcon kind="folder" size={19} /> {t('REELS & SHORTS')}
      </button>
      <button type="button" className={`work-tab ${tab === 'long' ? 'active' : ''}`} onClick={() => setTab('long')} role="tab" aria-selected={tab === 'long'}>
        <XPIcon kind="folder" size={19} /> {t('LONG FORM')}
      </button>
    </div>
    {visibleProjects.length > 0 ? (
      <div className={`projects-grid ${tab === 'short' ? 'short-projects-grid' : 'long-projects-grid'}`}>
        {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onOpen={(item) => actions.open('player', item)} />)}
      </div>
    ) : (
      <div className="work-empty"><XPIcon kind="folder" size={48} /><strong>{t(tab === 'short' ? 'NO SHORT VIDEOS YET' : 'NO LONG VIDEOS YET')}</strong><span>{t('Add entries in data/projects.ts and paste a YouTube or Instagram link in the video field.')}</span></div>
    )}
  </div>;
}
export function PlayerContent({ project, actions }: { project: Project; actions: ContentActions }) {
  const { t } = useLanguage();
  const youtubeEmbedUrl = project.platform === 'youtube' ? getYouTubeEmbedUrl(project.video) : null;
  const instagramEmbedUrl = project.platform === 'instagram' ? getInstagramEmbedUrl(project.video) : null;
  const isShort = project.format === 'short';
  const isInstagram = project.platform === 'instagram';
  const embedUrl = isInstagram ? instagramEmbedUrl : youtubeEmbedUrl;
  const platformLabel = isInstagram ? 'INSTAGRAM' : 'YOUTUBE';
  const missingMessage = isInstagram ? 'INSTAGRAM LINK NOT CONFIGURED' : 'YOUTUBE LINK NOT CONFIGURED';
  const setupMessage = isInstagram
    ? 'Add a public Instagram Reel URL in data/projects.ts.'
    : 'Add a YouTube URL in data/projects.ts.';
  return <div className="player-window">
    <div className="player-header"><div className="player-file"><XPIcon kind="video" size={24} /><div><strong>{project.filename}</strong><span>{t(project.category)} / {t(project.title)}</span></div></div><span className="player-format">{platformLabel}</span></div>
    <div className={`video-stage ${isInstagram ? 'instagram-stage' : 'youtube-stage'} ${isShort ? 'vertical-stage' : ''}`}>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={project.title}
          className={`${isInstagram ? 'instagram-player' : 'youtube-player'} ${isShort ? 'vertical-player' : ''}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="origin"
          allowFullScreen
        />
      ) : (
        <div className="youtube-unconfigured"><XPIcon kind="video" size={52} /><strong>{t(missingMessage)}</strong><span>{t(setupMessage)}</span></div>
      )}
    </div>
    <div className="player-info"><div><span>{t('DESCRIPTION')}</span><p>{t(project.description)}</p></div><div><span>{t('SOFTWARE')}</span><p>{project.software.join(' / ')}</p></div></div>
    <div className="player-footer"><span>▶ {t('PLAYBACK READY')}</span><button type="button" className="xp-button compact" onClick={() => actions.notify(t('Project opened successfully.'))}>{t('READY')}</button></div>
  </div>;
}
export function AboutContent() {
  const { t } = useLanguage();
  return <div className="notepad">
    <Toolbar items={['File', 'Edit', 'Format', 'View', '?']} />
    <div className="notepad-ruler">Ln 1, Col 1 &nbsp;&nbsp;&nbsp; Windows Text Document &nbsp;&nbsp;&nbsp; UTF-8</div>
    <textarea aria-label={t('About Me')} defaultValue={`CAPIMASO\n${t(profile.role)}\n\n${t(profile.bio)}`} />
  </div>;
}
export function SkillsContent() {
  const { t } = useLanguage();
  return <div className="system-properties">
    <div className="properties-tabs"><span className="active">{t('GENERAL')}</span><span>{t('DETAILS')}</span><span>{t('TOOLS')}</span></div>
    <div className="system-summary"><XPIcon kind="computer" size={62} /><div><strong>{t('CAPIMASO SYSTEM')}</strong><span>{t('VIDEO EDITING WORKSTATION')}</span><small>{t('Tools currently listed in the portfolio.')}</small></div></div>
    <div className="skills-list">{skills.map((skill) => <div key={skill.name} className="skill-row"><XPIcon kind="program" size={34} /><div className="skill-main"><strong>{skill.name}</strong><span>{t(skill.category)} · {t(skill.description)}</span></div><span className="skill-specialty">{t(skill.specialty)}</span></div>)}</div>
  </div>;
}
export function ServicesContent() {
  const { t } = useLanguage();
  return <div className="services-app">
    <div className="services-hero"><div><p className="eyebrow">CAPIMASO_SERVICES.EXE</p><h2>{t('EDITING SERVICES')}</h2></div><span className="service-status"><span className="online-dot" /> {t('AVAILABLE')}</span></div>
    <div className="services-grid">{services.map((service) => <div className="service-row" key={service.id}><XPIcon kind="service" size={36} /><div><strong>{t(service.name)}</strong><span>{t(service.description)}</span></div><b>{service.price}</b></div>)}</div>
    <div className="packages">
      <div className="section-caption"><strong>{t('SHORT FORM PACKAGES')}</strong><span>{t('UP TO 60s')}</span></div>
      <div className="package-grid short-packages-grid">{shortPackages.map((item) => <div key={item.name} className="package-card"><strong>{item.name}</strong><span>{item.price}</span>{item.unitPrice && <small>{item.unitPrice}</small>}<small>{t(item.benefits)}</small><small>{t('DEADLINE')}: {t(item.turnaround)}</small><small>{t('REVISIONS')}: {t(item.revisions)}</small></div>)}</div>
      <p className="pricing-note">{t('Values for short videos up to 60 seconds. Prices may vary for longer videos.')}</p>
    </div>
    <div className="long-form-box"><div><span className="strip-label">{t('LONG FORM')}</span><strong>{longFormPricing.startingPrice}</strong><p>{t(longFormPricing.note)}</p></div><span className="custom-quote-tag">{t('CUSTOM QUOTE')}</span></div>
  </div>;
}
export function ContactContent({ actions }: { actions: ContentActions }) {
  const { t } = useLanguage();
  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value); actions.notify(t('DATA COPIED TO CLIPBOARD')); }
    catch { actions.notify(t('Clipboard unavailable. Copy it manually.')); }
  };
  const openSocial = (href: string, value: string) => {
    if (value.includes('YOUR_')) { actions.notify(t('Replace this placeholder in data/socials.ts first.')); return; }
    window.location.href = href;
  };
  return <div className="outlook">
    <div className="outlook-brand"><div className="mail-logo"><XPIcon kind="mail" size={42} /></div><div><strong>OUTLOOK EXPRESS</strong><span>CAPIMASO MAILBOX</span></div></div>
    <div className="outlook-banner"><span>{t('LET\'S WORK TOGETHER')}</span><small>{t('For projects, availability and editing requests.')}</small></div>
    <div className="contact-list">{socials.map((social) => <div className="contact-row" key={social.id}><div className="contact-label"><XPIcon kind="mail" size={26} /><strong>{t(social.name)}</strong></div><code>{social.value}</code><div className="contact-actions">{social.href && <button type="button" className="xp-button compact" onClick={() => openSocial(social.href!, social.value)}>{t('OPEN')}</button>}<button type="button" className="xp-button compact" onClick={() => copy(social.value)}>{t('COPY')}</button></div></div>)}</div>
  </div>;
}
export function RecycleContent() {
  const { t } = useLanguage();
  return <div className="recycle-content"><XPIcon kind="recycle" size={70} /><div><h2>{t('RECYCLE BIN')}</h2><p>{t('Nothing interesting here.')}</p><span>{t('0 objects')}</span></div><div className="recycle-joke">{t('Maybe later.')}</div></div>;
}
export function PropertiesContent() {
  const { t } = useLanguage();
  return <div className="properties-dialog"><XPIcon kind="computer" size={70} /><div><h2>{t('CAPIMASO SYSTEM')}</h2><p>{t('Personal video editing portfolio running locally in your browser.')}</p><div className="property-line"><span>{t('System')}</span><strong>CAPIMASO.EXE</strong></div><div className="property-line"><span>{t('Mode')}</span><strong>{t('PORTFOLIO')}</strong></div><div className="property-line"><span>{t('Media')}</span><strong>{t('LOCAL ASSETS')}</strong></div></div></div>;
}
