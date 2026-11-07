import type { SystemSounds } from '../sound-manager';
import type { YouTubePlayer } from './youtube-api';

type AudioTarget = Pick<YouTubePlayer, 'setVolume' | 'isMuted' | 'mute' | 'unMute'>;
type MasterAudio = Pick<SystemSounds, 'getVolume' | 'getMuted' | 'subscribe'>;

/** The provider receives master × local gain; the WMP slider keeps its own value. */
export class VideoAudio {
  private volume = 80;
  private muted = true;
  private target?: AudioTarget;
  private unsubscribe?: () => void;
  private appliedMute = true;
  private pendingMute?: boolean;

  constructor(private master: MasterAudio) {}

  connect(target: AudioTarget, onError: () => void) {
    this.disconnect();
    this.target = target;
    this.unsubscribe = this.master.subscribe(() => {
      try { this.apply(); } catch { onError(); }
    });
    this.apply();
  }

  disconnect() {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.target = undefined;
    this.pendingMute = undefined;
  }

  private apply() {
    if (!this.target) return;
    const muted = this.master.getMuted() || this.master.getVolume() === 0 || this.muted;
    this.target.setVolume(this.volume * this.master.getVolume());
    this.appliedMute = muted;
    // IFrame API commands acknowledge asynchronously. Do not mistake a stale
    // isMuted() result for a user changing the video's own mute preference.
    this.pendingMute = this.target.isMuted() === muted ? undefined : muted;
    if (muted) this.target.mute(); else this.target.unMute();
  }

  snapshot() {
    if (this.target) {
      const observed = this.target.isMuted();
      if (this.pendingMute === observed) this.pendingMute = undefined;
      if (this.pendingMute === undefined && observed !== this.appliedMute) {
        if (this.master.getMuted() || this.master.getVolume() === 0) this.apply();
        else { this.muted = observed; this.appliedMute = observed; }
      }
    }
    return { volume: this.volume, muted: this.muted };
  }

  setVolume(value: number) {
    if (!Number.isFinite(value)) return;
    this.volume = Math.max(0, Math.min(100, value));
    this.muted = this.volume === 0;
    this.apply();
  }

  toggleMuted() {
    this.muted = !this.muted;
    this.apply();
  }
}
