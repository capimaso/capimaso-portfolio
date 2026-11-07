/** Small shared loader for the official IFrame API. No streams or credentials. */
export type YouTubePlayer = {
  playVideo(): void; pauseVideo(): void; seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number; getDuration(): number; getPlayerState(): number;
  getVolume(): number; setVolume(volume: number): void; isMuted(): boolean; mute(): void; unMute(): void;
  destroy(): void;
};
type PlayerEvent = { target: YouTubePlayer };
type PlayerOptions = { events: { onReady(event: PlayerEvent): void; onStateChange(): void; onError(): void; onAutoplayBlocked(): void } };
type YouTubeAPI = { Player: new (element: HTMLIFrameElement, options: PlayerOptions) => YouTubePlayer };

declare global {
  interface Window { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void }
}

let pending: Promise<YouTubeAPI> | undefined;
export function loadYouTubeAPI(): Promise<YouTubeAPI> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (pending) return pending;
  pending = new Promise<YouTubeAPI>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    const timer = window.setTimeout(fail, 12000);
    function cleanup() {
      window.clearTimeout(timer);
      script.onerror = null;
      if (window.onYouTubeIframeAPIReady === ready) window.onYouTubeIframeAPIReady = previous;
    }
    function fail() {
      cleanup(); script.remove(); pending = undefined;
      reject(new Error('youtube-api-unavailable'));
    }
    function ready() {
      cleanup();
      try { previous?.(); } catch { /* Another consumer must not break this loader. */ }
      if (window.YT?.Player) resolve(window.YT);
      else fail();
    }
    window.onYouTubeIframeAPIReady = ready;
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return pending;
}

export function playerTime(value: number): string {
  const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  return `${hours ? `${hours}:` : ''}${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
