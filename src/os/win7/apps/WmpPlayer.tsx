'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useT } from '@/src/shared/LanguageContext';
import { googleDriveEmbed } from '@/lib/google-drive.mjs';
import { youtubeEmbed, type ShowcaseItem } from '@/lib/showcase';
import { useMediaCatalog, type MediaSelection } from '../MediaCatalog';
import { useYouTubePlayer } from './useYouTubePlayer';
import { playerTime } from './youtube-api';
import styles from './wmp.module.css';

export default function WmpPlayer({ item, onMedia }: { item: ShowcaseItem; onMedia: (selection: MediaSelection) => void }) {
  const t = useT();
  const { showcase } = useMediaCatalog();
  const playlist = showcase.some(video => video.id === item.id) ? showcase.filter(video => video.format === item.format) : [item];
  const index = playlist.findIndex(video => video.id === item.id);
  const drive = item.format === 'short' ? googleDriveEmbed(item.video) : null;
  const youtube = item.format === 'long' ? youtubeEmbed(item.video) : null;
  const player = useYouTubePlayer(youtube, item.title);
  const { state } = player;
  const root = useRef<HTMLElement>(null);
  const listToggle = useRef<HTMLButtonElement>(null);
  const [showList, setShowList] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [notice, setNotice] = useState('');
  const fallback = youtube && state.failed ? `${youtube}&autoplay=1&mute=1&playsinline=1` : null;
  const controllable = Boolean(youtube && !state.failed);

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  function step(delta: number) {
    const next = playlist[index + delta];
    if (next) onMedia({ kind: 'video', id: next.id });
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === root.current) await document.exitFullscreen();
      else if (root.current?.requestFullscreen) await root.current.requestFullscreen();
      else setNotice(t('Use o botão de tela cheia do vídeo.'));
    } catch { setNotice(t('Use o botão de tela cheia do vídeo.')); }
  }
  function keyboard(event: KeyboardEvent) {
    if (event.key === 'Escape' && showList) { setShowList(false); listToggle.current?.focus(); return; }
    if (event.ctrlKey || event.metaKey || event.altKey || (event.target as HTMLElement).closest('button, input, a')) return;
    if (!controllable || !state.ready) return;
    if (event.key === ' ' || event.key.toLowerCase() === 'k') { event.preventDefault(); player.toggle(); }
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); player.seek(state.current + (event.key === 'ArrowLeft' ? -5 : 5)); }
    else if (event.key.toLowerCase() === 'm') { event.preventDefault(); player.mute(); }
    else if (event.key.toLowerCase() === 'f') { event.preventDefault(); void toggleFullscreen(); }
  }

  return <article ref={root} className={styles.player} data-video-player={item.id} data-wmp-player
    tabIndex={0} onKeyDown={keyboard} aria-label={`${t('Reprodutor de vídeo')} · ${t(item.title)}`}>
    <header className={styles.heading}>
      <div><h1>{t(item.title)}</h1><p>{t(item.category)}</p></div>
      <button ref={listToggle} type="button" className={styles.listToggle} aria-expanded={showList} aria-controls="wmp-playlist"
        title={t('Mostrar lista')} aria-label={t('Mostrar lista')} onClick={() => setShowList(value => !value)}><Glyph name="list" /></button>
    </header>
    <div className={styles.screen}>
      {youtube && !state.failed && <div className={styles.landscape} ref={player.mount} data-youtube-mount />}
      {(drive || fallback) && <iframe className={drive ? styles.portrait : styles.landscape} src={drive || fallback!}
        title={t(item.title)} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin" />}
      {!drive && !youtube && <p>{t('Vídeo ainda não configurado.')}</p>}
    </div>
    {showList && <aside id="wmp-playlist" className={styles.playlist} aria-label={t('Lista de reprodução')}
      onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setShowList(false); listToggle.current?.focus(); } }}>
      <h2>{t('Lista de reprodução')}</h2>
      {playlist.map((video, number) => <button type="button" key={video.id} aria-current={video.id === item.id ? 'true' : undefined}
        onClick={() => { setShowList(false); onMedia({ kind: 'video', id: video.id }); }}>
        <span>{number + 1}.</span><span>{t(video.title)}</span>
      </button>)}
      <p>{t(item.description)}</p><small>{item.software}</small>
      <a href={item.video} target="_blank" rel="noopener noreferrer">{t('Abrir vídeo original')}</a>
    </aside>}
    <div className={styles.bottom}>
      {controllable && <input className={styles.seek} type="range" min={0} max={state.duration || 1} step={1}
        value={Math.min(state.current, state.duration || 0)} disabled={!state.ready || !state.duration}
        aria-label={t('Posição de reprodução')} aria-valuetext={`${playerTime(state.current)} / ${playerTime(state.duration)}`}
        style={{ '--progress': `${state.duration ? state.current / state.duration * 100 : 0}%` } as CSSProperties}
        onChange={event => player.seek(Number(event.target.value))} />}
      <div className={styles.transportRow}>
        <output className={styles.time} aria-label={t('Tempo de reprodução')} aria-live="off">{controllable && state.ready ? playerTime(state.current) : '—:—'}</output>
        <div className={styles.transport}>
          {controllable && <button type="button" disabled={!state.ready} title={t('Parar')} aria-label={t('Parar')} onClick={player.stop}><Glyph name="stop" /></button>}
          <button type="button" disabled={index <= 0} title={t('Vídeo anterior')} aria-label={t('Vídeo anterior')} onClick={() => step(-1)}><Glyph name="previous" /></button>
          {controllable && <button type="button" className={styles.play} disabled={!state.ready} title={t(state.playing ? 'Pausar' : 'Reproduzir')}
            aria-label={t(state.playing ? 'Pausar' : 'Reproduzir')} onClick={player.toggle}><Glyph name={state.playing ? 'pause' : 'play'} /></button>}
          <button type="button" disabled={index >= playlist.length - 1} title={t('Próximo vídeo')} aria-label={t('Próximo vídeo')} onClick={() => step(1)}><Glyph name="next" /></button>
          {controllable && <>
            <span className={styles.separator} />
            <button type="button" disabled={!state.ready} title={t(state.muted ? 'Ativar áudio' : 'Silenciar áudio')}
              aria-label={t(state.muted ? 'Ativar áudio' : 'Silenciar áudio')} onClick={player.mute}><Glyph name={state.muted ? 'muted' : 'volume'} /></button>
            <input className={styles.volume} type="range" min={0} max={100} step={1} value={state.volume} disabled={!state.ready}
              style={{ '--progress': `${state.volume}%` } as CSSProperties}
              aria-label={t('Volume do vídeo')} onChange={event => player.volume(Number(event.target.value))} />
          </>}
        </div>
        <button type="button" className={styles.fullscreen} aria-label={t(fullscreen ? 'Sair da tela cheia' : 'Tela cheia')}
          title={t(fullscreen ? 'Sair da tela cheia' : 'Tela cheia')} onClick={() => void toggleFullscreen()}><Glyph name="fullscreen" /></button>
      </div>
      <div className={styles.status} role="status">
        {notice || (state.failed ? t('Use os controles do vídeo ou abra o original.') : drive ? t('Use os controles do vídeo.') : youtube && !state.ready ? t('Carregando...') : '')}
        <a href={item.video} target="_blank" rel="noopener noreferrer">{t('Abrir vídeo original')}</a>
      </div>
    </div>
  </article>;
}

function Glyph({ name }: { name: 'list' | 'stop' | 'previous' | 'next' | 'pause' | 'play' | 'volume' | 'muted' | 'fullscreen' }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" focusable="false">
    {name === 'play' && <path d="M7 3 21 12 7 21Z" />}
    {name === 'pause' && <path d="M5 4h5v16H5zm9 0h5v16h-5z" />}
    {name === 'stop' && <path d="M6 6h12v12H6z" />}
    {name === 'previous' && <path d="M4 5h3v14H4zm15 0L8 12l11 7z" />}
    {name === 'next' && <path d="M17 5h3v14h-3zM5 5l11 7-11 7z" />}
    {(name === 'volume' || name === 'muted') && <><path d="M3 9h4l6-5v16l-6-5H3z" />
      {name === 'volume' ? <path d="M16 7q5 5 0 10m3-13q8 8 0 16" fill="none" stroke="currentColor" strokeWidth="1.7" /> : <path d="m16 9 6 6m0-6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" />}</>}
    {name === 'list' && <path d="M3 3h6v6H3zm12 0h6v6h-6zM3 15h6v6H3zm12 0h6v6h-6z" />}
    {name === 'fullscreen' && <path d="M3 9V3h6v2H5v4zm12-6h6v6h-2V5h-4zM3 15h2v4h4v2H3zm16 0h2v6h-6v-2h4z" />}
  </svg>;
}
