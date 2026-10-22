import 'server-only';
import type { PhotoErrorCode } from '@/src/lib/photos';

export const FOLDER_MIME = 'application/vnd.google-apps.folder';
export const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/bmp'];
export type DriveFile = {
  id: string; name: string; mimeType: string; parents?: string[]; trashed?: boolean;
  resourceKey?: string; thumbnailLink?: string; imageMediaMetadata?: { width?: number; height?: number };
};
export type DriveConfig = { root: string; apiKey: string; resourceKey?: string };
export const fileFields = 'id,name,mimeType,parents,trashed,resourceKey,thumbnailLink,imageMediaMetadata(width,height)';

export class DriveError extends Error {
  constructor(public code: PhotoErrorCode, public status: number) { super(code); }
}

export function validateId(id: string) {
  if (!/^[\w-]{1,200}$/.test(id)) throw new DriveError('invalid_request', 400);
  return id;
}

export function parsePath(path: string | null): string[] | undefined {
  if (!path) return undefined;
  const ids = path.split('/');
  if (ids.length > 63 || new Set(ids).size !== ids.length) throw new DriveError('invalid_request', 400);
  return ids.map(validateId);
}

export function driveConfig(): DriveConfig {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY?.trim();
  let root = process.env.DRIVE_FOLDER_ID?.trim();
  let resourceKey = process.env.DRIVE_FOLDER_RESOURCE_KEY?.trim();
  if (!apiKey || !root) throw new DriveError('not_configured', 503);
  if (root.startsWith('https://')) {
    try {
      const url = new URL(root);
      if (url.hostname !== 'drive.google.com') throw Error();
      root = url.pathname.match(/\/folders\/([\w-]+)\/?$/)?.[1];
      resourceKey ||= url.searchParams.get('resourcekey') || undefined;
    } catch { throw new DriveError('not_configured', 503); }
  }
  if (!root || !/^[\w-]{1,200}$/.test(root) || (resourceKey && !/^[\w-]{1,200}$/.test(resourceKey))) throw new DriveError('not_configured', 503);
  return { root, apiKey, resourceKey };
}

export function providerError(status: number, reason?: string): DriveError {
  if (status === 429 || reason?.toLowerCase().includes('ratelimit') || reason === 'dailyLimitExceeded') return new DriveError('rate_limited', 429);
  if (status === 404) return new DriveError('not_found', 404);
  if (status === 401 || status === 403) return new DriveError('access_denied', 403);
  if (status === 400) return new DriveError('invalid_request', 400);
  return new DriveError('unavailable', 502);
}

export async function driveRequest(config: DriveConfig, path: string, params: Record<string, string>, keys: Map<string, string>) {
  const url = new URL(`https://www.googleapis.com/drive/v3/${path}`);
  url.search = new URLSearchParams({ supportsAllDrives: 'true', ...params }).toString();
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'X-Goog-Api-Key': config.apiKey,
        ...(keys.size ? { 'X-Goog-Drive-Resource-Keys': [...keys].map(([id, key]) => `${id}/${key}`).join(',') } : {}) },
      cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(15000),
    });
  } catch { throw new DriveError('unavailable', 502); }
  if (!response.ok && !(response.status >= 300 && response.status < 400)) {
    // Google's temporary automation challenge is HTML, not a Drive permission
    // error. Do not retry around the challenge or relay its page to the client.
    if (response.status === 403 && response.headers.get('content-type')?.includes('text/html')) {
      await response.body?.cancel(); throw new DriveError('rate_limited', 429);
    }
    const body = await response.json().catch(() => null);
    throw providerError(response.status, body?.error?.errors?.[0]?.reason);
  }
  return response;
}

// Only URLs supplied by the Drive API are passed here, never client-supplied URLs.
export async function googleImageRequest(input: string) {
  let url: URL;
  try { url = new URL(input); } catch { throw new DriveError('unavailable', 502); }
  for (let hop = 0; hop < 5; hop++) {
    if (url.protocol !== 'https:' || url.port || url.username || url.password
      || !(url.hostname === 'googleusercontent.com' || url.hostname.endsWith('.googleusercontent.com') || url.hostname === 'drive.usercontent.google.com')) throw new DriveError('unavailable', 502);
    let response: Response;
    try { response = await fetch(url, { redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(20000) }); }
    catch { throw new DriveError('unavailable', 502); }
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (!location) throw new DriveError('unavailable', 502);
      url = new URL(location, url); continue;
    }
    if (!response.ok) {
      const challenged = response.status === 403 && response.headers.get('content-type')?.includes('text/html');
      await response.body?.cancel();
      throw challenged ? new DriveError('rate_limited', 429) : providerError(response.status);
    }
    return response;
  }
  throw new DriveError('unavailable', 502);
}

export function errorResponse(error: unknown) {
  // Never return/log provider bodies, request URLs or environment values.
  const safe = error instanceof DriveError ? error : new DriveError('unavailable', 502);
  return Response.json({ error: { code: safe.code } }, { status: safe.status, headers: { 'Cache-Control': 'no-store', ...(safe.status === 429 ? { 'Retry-After': '60' } : {}) } });
}
