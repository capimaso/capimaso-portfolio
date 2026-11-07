'use client';

import { useEffect, useRef, useState } from 'react';
import { loadYouTubeAPI, type YouTubePlayer } from './youtube-api';
import { useSoundManager } from '../SoundManager';
import { VideoAudio } from './video-audio';

const initial = { ready: false, failed: false, playing: false, current: 0, duration: 0, volume: 80, muted: true };

export function useYouTubePlayer(embed: string | null, title: string) {
  const sounds = useSoundManager();
  const mount = useRef<HTMLDivElement>(null);
  const api = useRef<YouTubePlayer | null>(null);
  const audio = useRef<VideoAudio | null>(null);
  const pendingSeek = useRef<{ value: number; until: number } | null>(null);
  const [state, setState] = useState(initial);

  useEffect(() => {
    const host = mount.current;
    if (!embed || !host) return;
    let disposed = false;
    let player: YouTubePlayer | undefined;
    let poll: number | undefined;
    let readyTimeout: number | undefined;
    const mixer = new VideoAudio(sounds);
    audio.current = mixer;
    setState(initial);
    pendingSeek.current = null;
    function release() {
      disposed = true;
      window.clearInterval(poll); window.clearTimeout(readyTimeout);
      mixer.disconnect();
      if (audio.current === mixer) audio.current = null;
      api.current = null;
      try { player?.destroy(); } catch {}
      host?.replaceChildren();
    }
    function fail() {
      if (disposed) return;
      setState(current => ({ ...current, failed: true, ready: false, playing: false }));
      release();
    }
    function sync() {
      if (disposed || !player || !api.current) return;
      try {
        let current = player.getCurrentTime();
        const duration = player.getDuration(), pending = pendingSeek.current;
        // A buffering event can arrive before the seek acknowledgement. Keep the
        // slider at the requested position so the native change event cannot seek back.
        if (pending && Date.now() < pending.until && Math.abs(current - pending.value) > .25) current = pending.value;
        else pendingSeek.current = null;
        setState({ ready: true, failed: false, playing: player.getPlayerState() === 1,
          current: Number.isFinite(current) ? Math.max(0, current) : 0,
          duration: Number.isFinite(duration) ? Math.max(0, duration) : 0,
          ...mixer.snapshot() });
      } catch { fail(); }
    }
    void loadYouTubeAPI().then(YT => {
      if (disposed) return;
      const frame = document.createElement('iframe');
      const url = new URL(embed!);
      url.searchParams.set('enablejsapi', '1'); url.searchParams.set('origin', window.location.origin);
      url.searchParams.set('controls', '0'); url.searchParams.set('autoplay', '0');
      url.searchParams.set('mute', '1'); url.searchParams.set('playsinline', '1');
      frame.src = url.href; frame.title = title; frame.allowFullscreen = true;
      frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      host.appendChild(frame);
      readyTimeout = window.setTimeout(fail, 15000);
      player = new YT.Player(frame, { events: {
        onReady: event => {
          if (disposed) return;
          window.clearTimeout(readyTimeout);
          api.current = event.target; player = event.target;
          player.mute(); mixer.connect(player, fail); player.playVideo();
          sync(); poll = window.setInterval(sync, 500);
        },
        onStateChange: sync, onError: fail, onAutoplayBlocked: sync,
      } });
    }).catch(fail);
    return release;
  }, [embed, title, sounds]);

  function toggle() {
    if (!state.ready || !api.current) return;
    if (state.playing) api.current.pauseVideo(); else api.current.playVideo();
  }
  function seek(value: number) {
    if (!state.ready || !api.current || !Number.isFinite(value) || !state.duration) return;
    const target = Math.max(0, Math.min(state.duration, value));
    pendingSeek.current = { value: target, until: Date.now() + 5000 };
    setState(current => ({ ...current, current: target }));
    api.current.seekTo(target, true);
  }
  function stop() { if (state.ready) { api.current?.pauseVideo(); seek(0); } }
  function volume(value: number) {
    if (!state.ready || !audio.current) return;
    audio.current.setVolume(value);
    const next = audio.current.snapshot();
    setState(current => ({ ...current, ...next }));
  }
  function mute() {
    if (!state.ready || !audio.current) return;
    audio.current.toggleMuted();
    const next = audio.current.snapshot();
    setState(current => ({ ...current, ...next }));
  }
  return { mount, state, toggle, seek, stop, volume, mute };
}
