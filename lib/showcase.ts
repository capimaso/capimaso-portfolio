import entries from '@/data/showcase.json';
export type ShowcaseItem = { id: string; title: string; description: string; category: string; format: 'short'|'long'; video: string; thumbnail: string; software: string };
export function getShowcase(): ShowcaseItem[] { return entries as ShowcaseItem[]; }
export function youtubeId(url: string): string | null {
  try { const u = new URL(url); if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0];
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v') || u.pathname.match(/\/(?:shorts|embed|live)\/([^/?]+)/)?.[1] || null; }
  catch {} return null;
}
export function youtubePoster(url: string): string | null { const id=youtubeId(url); return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null; }
export function youtubeEmbed(url: string): string | null {
  const id = youtubeId(url); if (!id) return null;
  let start = 0; try { const t = new URL(url).searchParams.get('t'); if(t) start=Number(t.replace(/s$/, ''))||0; } catch {}
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0${start ? `&start=${start}` : ''}`;
}
export function isLocalVideo(url: string) { return url.startsWith('/videos/') && /\.(mp4|webm|ogg)$/i.test(url); }
