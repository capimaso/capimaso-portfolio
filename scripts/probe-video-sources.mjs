/** Read-only public-link probe. Never loads environment credentials or saves video bytes. */
import { readFile } from 'node:fs/promises';
import { googleDriveEmbed } from '../lib/google-drive.mjs';

const entries = JSON.parse(await readFile(new URL('../data/showcase.json', import.meta.url), 'utf8'));
const results = [];
for (const item of entries) {
  const preview = googleDriveEmbed(item.video);
  if (!preview) {
    let youtube = false;
    try {
      const url = new URL(item.video);
      youtube = url.protocol === 'https:' && ['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be'].includes(url.hostname);
    } catch {}
    results.push({ id: item.id, source: youtube ? 'youtube' : 'unsupported', nativeVideo: false,
      reason: youtube ? 'embed-requires-youtube-player' : 'no-supported-public-source' });
    continue;
  }
  const file = new URL(preview);
  const download = new URL('https://drive.usercontent.google.com/download');
  download.searchParams.set('id', file.pathname.split('/')[3]);
  download.searchParams.set('export', 'download');
  if (file.searchParams.has('resourcekey')) download.searchParams.set('resourcekey', file.searchParams.get('resourcekey'));
  try {
    const response = await fetch(download, { headers: { Range: 'bytes=0-1023' }, signal: AbortSignal.timeout(15000) });
    const type = response.headers.get('content-type')?.split(';')[0] || '';
    const contentRange = response.headers.get('content-range');
    const partialVideo = response.status === 206 && type.startsWith('video/') && /^bytes 0-1023\/\d+$/.test(contentRange || '');
    // Cancel immediately: headers are sufficient to reject HTML and unbounded downloads.
    await response.body?.cancel();
    results.push({ id: item.id, source: 'drive-public-download', status: response.status, contentType: type,
      rangeSupported: partialVideo, nativeVideo: false,
      reason: partialVideo ? 'range-response-needs-browser-playback-validation' : 'no-validated-partial-video-response' });
  } catch {
    results.push({ id: item.id, source: 'drive-public-download', nativeVideo: false, reason: 'public-request-failed-or-timed-out' });
  }
}
console.log(JSON.stringify(results, null, 2));
