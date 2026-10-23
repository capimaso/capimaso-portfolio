import { win7SoundFiles, type Win7Sound } from '@/src/lib/win7-sounds';

export interface SystemSounds { enable(): void; play(name: Win7Sound): void; dispose(): void }

export class SoundManager implements SystemSounds {
  private enabled = false;
  private audio = new Map<Win7Sound, HTMLAudioElement>();
  private missing = new Set<Win7Sound>();
  private lastError = 0;
  constructor(private available: readonly Win7Sound[], private createAudio = (src: string) => new Audio(src)) {}

  enable() { this.enabled = true; }
  play(name: Win7Sound) {
    if (!this.enabled || !this.available.includes(name) || this.missing.has(name)) return;
    if (name === 'error') {
      if (Date.now() - this.lastError < 500) return;
      this.lastError = Date.now();
    }
    try {
      let audio = this.audio.get(name);
      if (!audio) {
        audio = this.createAudio(`/assets/win7/sounds/${win7SoundFiles[name]}`);
        audio.volume = .4;
        audio.onerror = () => { this.missing.add(name); };
        this.audio.set(name, audio);
      }
      audio.pause(); audio.currentTime = 0;
      // Missing files, decode failures and autoplay denial never interrupt the UI.
      void audio.play().catch(() => {});
    } catch { /* Silent fallback, including browsers without media support. */ }
  }
  dispose() {
    this.enabled = false;
    for (const audio of this.audio.values()) {
      try { audio.pause(); audio.onerror = null; audio.removeAttribute('src'); audio.load(); } catch {}
    }
    this.audio.clear();
  }
}
