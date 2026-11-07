import type { Win7Sound } from '@/src/lib/win7-sounds';
import { soundsMap } from '@/src/lib/sounds-map';

export interface SystemSounds {
  enable(): void; play(name: Win7Sound): void; dispose(): void;
  getMuted(): boolean; setMuted(muted: boolean): void; subscribe(listener: () => void): () => void;
  getVolume(): number; setVolume(volume: number): void;
  getStartupBlocked(): boolean;
}

export class SoundManager implements SystemSounds {
  private enabled = false;
  private muted = false;
  private volume = .8;
  private pendingStartup = false;
  private listeners = new Set<() => void>();
  private audio = new Map<Win7Sound, HTMLAudioElement>();
  private missing = new Set<Win7Sound>();
  private lastError = 0;
  constructor(private available: readonly Win7Sound[], private createAudio = (src: string) => new Audio(src)) {}

  enable() {
    this.enabled = true;
    if (this.pendingStartup) {
      this.pendingStartup = false;
      for (const listener of this.listeners) listener();
      this.play('startup');
    }
  }
  getStartupBlocked = () => this.pendingStartup;
  getMuted = () => this.muted;
  getVolume = () => this.volume;
  setVolume(volume: number) {
    if (!Number.isFinite(volume)) return;
    const next = Math.max(0, Math.min(1, volume));
    if (this.volume === next) return;
    this.volume = next;
    for (const audio of this.audio.values()) audio.volume = next;
    for (const listener of this.listeners) listener();
  }
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  setMuted(muted: boolean) {
    if (this.muted === muted) return;
    this.muted = muted;
    for (const audio of this.audio.values()) {
      audio.muted = muted;
      if (muted) { try { audio.pause(); } catch {} }
    }
    for (const listener of this.listeners) listener();
  }
  play(name: Win7Sound) {
    // Only the welcome sound may attempt autoplay before a user gesture.
    if ((!this.enabled && name !== 'startup') || this.muted || !this.available.includes(name) || this.missing.has(name)) return;
    if (name === 'error') {
      if (Date.now() - this.lastError < 500) return;
      this.lastError = Date.now();
    }
    try {
      let audio = this.audio.get(name);
      if (!audio) {
        audio = this.createAudio(soundsMap[name]);
        audio.volume = this.volume;
        audio.onerror = () => { this.missing.add(name); };
        this.audio.set(name, audio);
      }
      audio.pause(); audio.currentTime = 0;
      // Missing files, decode failures and autoplay denial never interrupt the UI.
      void audio.play().then(() => {
        if (name === 'startup' && this.pendingStartup && this.audio.get(name) === audio) {
          this.pendingStartup = false;
          for (const listener of this.listeners) listener();
        }
      }, () => {
        if (name === 'startup' && this.audio.get(name) === audio) {
          this.pendingStartup = true;
          for (const listener of this.listeners) listener();
        }
      });
    } catch { /* Silent fallback, including browsers without media support. */ }
  }
  dispose() {
    this.enabled = false;
    this.pendingStartup = false;
    for (const audio of this.audio.values()) {
      try { audio.pause(); audio.onerror = null; audio.removeAttribute('src'); audio.load(); } catch {}
    }
    this.audio.clear();
  }
}
