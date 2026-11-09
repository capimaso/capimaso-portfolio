'use client';

import { useEffect, useRef, useState } from 'react';
import { useSoundManager } from '../SoundManager';
import { VideoAudio } from './video-audio';

const initial = { ready: false, failed: false, playing: false, current: 0, duration: 0, volume: 80, muted: true };

export function useNativeVideoPlayer(source: string | null) {
  const video = useRef<HTMLVideoElement>(null);
  const audio = useRef<VideoAudio | null>(null);
  const sounds = useSoundManager();
  const [state, setState] = useState(initial);

  useEffect(() => {
    const element = video.current;
    if (!source || !element) return;
    let disposed = false;
    let readyTimeout: number | undefined;
    const mixer = new VideoAudio(sounds);
    audio.current = mixer;
    setState(initial);
    function sync() {
      if (disposed) return;
      if (element!.readyState >= 1) window.clearTimeout(readyTimeout);
      setState({ ready: element!.readyState >= 1, failed: false, playing: !element!.paused && !element!.ended,
        current: Number.isFinite(element!.currentTime) ? element!.currentTime : 0,
        duration: Number.isFinite(element!.duration) ? element!.duration : 0, ...mixer.snapshot() });
    }
    function fail() {
      if (disposed) return;
      disposed = true;
      window.clearTimeout(readyTimeout);
      mixer.disconnect();
      element!.pause();
      element!.removeAttribute('src');
      element!.load();
      setState(current => ({ ...current, failed: true, ready: false, playing: false }));
    }
    const target = {
      setVolume(value: number) { element.volume = value / 100; },
      isMuted() { return element.muted; },
      mute() { element.muted = true; },
      unMute() { element.muted = false; },
    };
    const events = ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended', 'seeked', 'volumechange'] as const;
    events.forEach(event => element.addEventListener(event, sync));
    element.addEventListener('error', fail);
    mixer.connect(target, fail);
    element.src = source;
    element.load();
    readyTimeout = window.setTimeout(fail, 25_000);
    return () => {
      disposed = true;
      window.clearTimeout(readyTimeout);
      events.forEach(event => element.removeEventListener(event, sync));
      element.removeEventListener('error', fail);
      mixer.disconnect();
      if (audio.current === mixer) audio.current = null;
      element.pause();
      element.removeAttribute('src');
      element.load();
    };
  }, [source, sounds]);

  function toggle() {
    if (!state.ready || !video.current) return;
    if (!video.current.paused) video.current.pause();
    else void video.current.play().catch(() => { /* A blocked play remains retryable. */ });
  }
  function seek(value: number) {
    if (state.ready && video.current && Number.isFinite(value) && state.duration) {
      video.current.currentTime = Math.max(0, Math.min(state.duration, value));
      setState(current => ({ ...current, current: video.current!.currentTime }));
    }
  }
  function stop() { video.current?.pause(); seek(0); }
  function volume(value: number) {
    if (!state.ready || !audio.current) return;
    audio.current.setVolume(value);
    setState(current => ({ ...current, ...audio.current!.snapshot() }));
  }
  function mute() {
    if (!state.ready || !audio.current) return;
    audio.current.toggleMuted();
    setState(current => ({ ...current, ...audio.current!.snapshot() }));
  }
  return { video, state, toggle, seek, stop, volume, mute };
}
