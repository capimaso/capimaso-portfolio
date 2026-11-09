import 'server-only';
import showcase from '@/data/showcase.json';
import { googleDriveEmbed } from '@/lib/google-drive.mjs';
import { DriveError, driveApiKey, driveRequest } from './client';

const types = new Set(['video/mp4', 'video/webm', 'video/ogg']);
const maxChunk = 4 * 1024 * 1024;
type Video = { id: string; mimeType: string; size: number; expires: number };
const metadata = new Map<string, Video>();

// This separate allowlist never broadens the photography proxy's public root.
// Neither a Drive ID nor an arbitrary URL is accepted from the request.
function catalogVideo(id: string) {
  const item = showcase.find(entry => entry.id === id && entry.format === 'short');
  const embed = item && googleDriveEmbed(item.video);
  if (!embed) throw new DriveError('not_found', 404);
  const url = new URL(embed);
  return { fileId: url.pathname.split('/')[3], resourceKey: url.searchParams.get('resourcekey') };
}

/** Cap open ranges so a video request remains small and seekable on Vercel. */
export function videoRange(header: string, size: number) {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (!match[1] && !match[2])) return null;
  const first = match[1] ? Number(match[1]) : undefined;
  const last = match[2] ? Number(match[2]) : undefined;
  if ((first !== undefined && !Number.isSafeInteger(first)) || (last !== undefined && !Number.isSafeInteger(last))) return null;
  const start = first ?? Math.max(0, size - Math.min(last!, maxChunk));
  const end = first === undefined ? size - 1 : Math.min(last ?? size - 1, size - 1, start + maxChunk - 1);
  if (start >= size || start > end || (first === undefined && last === 0)) return null;
  return { start, end };
}

export async function streamVideo(id: string, request: Request, head = false) {
  const { fileId, resourceKey } = catalogVideo(id);
  const config = { apiKey: driveApiKey() };
  const keys = new Map(resourceKey ? [[fileId, resourceKey]] : []);
  let file = metadata.get(fileId);
  if (!file || file.expires < Date.now()) {
    const response = await driveRequest(config, `files/${fileId}`, {
      fields: 'id,mimeType,size,trashed,capabilities(canDownload)',
    }, keys, { signal: request.signal });
    if (!response.ok) { await response.body?.cancel(); throw new DriveError('unavailable', 502); }
    const body = await response.json();
    const size = Number(body.size);
    if (body.id !== fileId || body.trashed || body.capabilities?.canDownload !== true) throw new DriveError('access_denied', 403);
    if (!types.has(body.mimeType) || !Number.isSafeInteger(size) || size <= 0) throw new DriveError('unavailable', 502);
    file = { id: fileId, mimeType: body.mimeType, size, expires: Date.now() + 60_000 };
    if (metadata.size >= 100) metadata.delete(metadata.keys().next().value!);
    metadata.set(fileId, file);
  }
  const headers = new Headers({ 'Content-Type': file.mimeType, 'Accept-Ranges': 'bytes',
    'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' });
  if (head) {
    headers.set('Content-Length', String(file.size));
    return new Response(null, { headers });
  }
  const input = request.headers.get('range');
  const range = input === null ? undefined : videoRange(input, file.size);
  if (range === null) {
    headers.set('Content-Range', `bytes */${file.size}`);
    return new Response(null, { status: 416, headers });
  }
  const upstream = await driveRequest(config, `files/${fileId}`, { alt: 'media' }, keys, {
    ...(range ? { range: `bytes=${range.start}-${range.end}` } : {}), signal: request.signal,
  });
  const type = upstream.headers.get('content-type')?.split(';')[0];
  const expectedRange = range && `bytes ${range.start}-${range.end}/${file.size}`;
  // Never send an HTML challenge, redirect or an ignored Range as video bytes.
  if (!upstream.body || !types.has(type || '') || type !== file.mimeType
    || (range ? upstream.status !== 206 || upstream.headers.get('content-range') !== expectedRange : upstream.status !== 200)) {
    await upstream.body?.cancel(); throw new DriveError('unavailable', 502);
  }
  headers.set('Content-Length', String(range ? range.end - range.start + 1 : file.size));
  if (expectedRange) headers.set('Content-Range', expectedRange);
  // Stream the provider body; no disk copies or whole-file buffers.
  return new Response(upstream.body, { status: range ? 206 : 200, headers });
}
