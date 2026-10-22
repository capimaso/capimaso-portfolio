import 'server-only';
import type { PhotoItem, PhotoListing } from '@/src/lib/photos';
import { DriveError, FOLDER_MIME, IMAGE_MIMES, driveConfig, driveRequest, fileFields, googleImageRequest, validateId, type DriveFile } from './client';

// Bounded process cache, never a permanent catalog or a disk copy of the gallery.
const metadata = new Map<string, { expires: number; file: DriveFile }>();
const listings = new Map<string, { expires: number; data: PhotoListing }>();
const parents = new Map<string, { parent: string; expires: number }>();
const TTL = 60_000;
function remember<T>(map: Map<string, T>, key: string, value: T) {
  if (map.size >= 1000) map.delete(map.keys().next().value!);
  map.set(key, value);
}

function session() {
  const config = driveConfig();
  const keys = new Map<string, string>(config.resourceKey ? [[config.root, config.resourceKey]] : []);
  async function get(id: string, fresh = false): Promise<DriveFile> {
    validateId(id);
    const cached = metadata.get(`${config.root}:${id}`);
    if (!fresh && cached && cached.expires > Date.now()) {
      if (cached.file.resourceKey) keys.set(id, cached.file.resourceKey);
      return cached.file;
    }
    // Resource keys learned from a listing can be reused to request fresh metadata.
    if (cached?.file.resourceKey) keys.set(id, cached.file.resourceKey);
    const response = await driveRequest(config, `files/${encodeURIComponent(id)}`, { fields: fileFields }, keys);
    if (!response.ok) throw new DriveError('unavailable', 502);
    const file = await response.json() as DriveFile;
    if (file.id !== id || !file.name || !file.mimeType) throw new DriveError('unavailable', 502);
    if (file.resourceKey) keys.set(id, file.resourceKey);
    remember(metadata, `${config.root}:${id}`, { file, expires: Date.now() + TTL });
    return file;
  }
  function cacheChild(file: DriveFile, parent: string) {
    const key = `${config.root}:${file.id}`;
    remember(metadata, key, { file, expires: Date.now() + TTL });
    remember(parents, key, { parent, expires: Date.now() + TTL });
    if (file.resourceKey) keys.set(file.id, file.resourceKey);
  }
  async function child(parent: string, id: string, fresh: boolean) {
    const known = parents.get(`${config.root}:${id}`);
    if (!fresh && known?.parent === parent && known.expires > Date.now()) return get(id);
    // Public files.get may omit parents. Verify membership with the provider's
    // parents filter, not with untrusted client breadcrumbs or a saved GET result.
    let pageToken: string | undefined;
    const seenTokens = new Set<string>();
    for (let page = 0; page < 100; page++) {
      const response = await driveRequest(config, 'files', {
        q: `'${parent}' in parents and trashed = false`, fields: `nextPageToken,files(${fileFields})`,
        pageSize: '100', includeItemsFromAllDrives: 'true', ...(pageToken ? { pageToken } : {}),
      }, keys);
      const body = await response.json() as { files?: DriveFile[]; nextPageToken?: string };
      if (!Array.isArray(body.files)) throw new DriveError('unavailable', 502);
      for (const file of body.files) if (!file.trashed) cacheChild(file, parent);
      const found = body.files.find(file => file.id === id && !file.trashed);
      if (found) return found;
      pageToken = body.nextPageToken;
      if (!pageToken) throw new DriveError('access_denied', 403);
      if (seenTokens.has(pageToken)) throw new DriveError('unavailable', 502);
      seenTokens.add(pageToken);
    }
    throw new DriveError('unavailable', 502);
  }
  async function authorize(id: string, fresh = false, path?: string[]) {
    let ids = path ? [...path, id] : [id];
    if (!path) {
      // A remembered parent is only a hint; child() must still verify membership.
      for (let depth = 0; ids[0] !== config.root && depth < 63; depth++) {
        const file = await get(ids[0]);
        const parent = file.parents?.[0] || parents.get(`${config.root}:${file.id}`)?.parent;
        if (!parent || ids.includes(parent)) throw new DriveError('access_denied', 403);
        ids.unshift(validateId(parent));
      }
    }
    if (ids[0] !== config.root || new Set(ids).size !== ids.length || ids.length > 64) throw new DriveError('access_denied', 403);
    const root = await get(config.root, fresh);
    if (root.mimeType !== FOLDER_MIME || root.trashed) throw new DriveError('not_configured', 503);
    const chain: DriveFile[] = [root];
    for (let index = 1; index < ids.length; index++) {
      if (chain[index - 1].mimeType !== FOLDER_MIME) throw new DriveError('access_denied', 403);
      const file = await child(ids[index - 1], validateId(ids[index]), fresh);
      if (file.trashed) throw new DriveError('not_found', 404);
      chain.push(file);
    }
    return chain;
  }
  return { config, keys, get, authorize, cacheChild };
}

export async function listPhotos(folderId?: string, pageToken?: string, refresh = false, path?: string[]): Promise<PhotoListing> {
  const api = session();
  const id = validateId(folderId || api.config.root);
  if (pageToken && (pageToken.length > 2048 || /[\x00-\x1f]/.test(pageToken))) throw new DriveError('invalid_request', 400);
  const chain = await api.authorize(id, refresh, path);
  const folder = chain[chain.length - 1];
  if (folder.mimeType !== FOLDER_MIME) throw new DriveError('invalid_request', 400);
  const key = `${api.config.root}:${id}:${pageToken || ''}`;
  if (refresh) {
    for (const cachedKey of listings.keys()) if (cachedKey.startsWith(`${api.config.root}:${id}:`)) listings.delete(cachedKey);
  } else {
    const cached = listings.get(key);
    if (cached && cached.expires > Date.now()) return cached.data;
  }
  const allowedMimes = [FOLDER_MIME, ...IMAGE_MIMES].map(mime => `mimeType = '${mime}'`).join(' or ');
  const response = await driveRequest(api.config, 'files', {
    q: `'${id}' in parents and trashed = false and (${allowedMimes})`,
    fields: `nextPageToken,files(${fileFields})`, pageSize: '100', orderBy: 'folder,name_natural',
    includeItemsFromAllDrives: 'true', ...(pageToken ? { pageToken } : {}),
  }, api.keys);
  const body = await response.json() as { files?: DriveFile[]; nextPageToken?: string };
  if (!Array.isArray(body.files)) throw new DriveError('unavailable', 502);
  const items: PhotoItem[] = [];
  for (const file of body.files) {
    if (file.trashed || (file.mimeType !== FOLDER_MIME && !IMAGE_MIMES.includes(file.mimeType))) continue;
    validateId(file.id);
    api.cacheChild(file, id);
    items.push({ id: file.id, name: file.name, kind: file.mimeType === FOLDER_MIME ? 'folder' : 'image', mimeType: file.mimeType,
      ...(file.imageMediaMetadata?.width ? { width: file.imageMediaMetadata.width } : {}),
      ...(file.imageMediaMetadata?.height ? { height: file.imageMediaMetadata.height } : {}) });
  }
  const data: PhotoListing = {
    folder: { id: folder.id, name: folder.name }, breadcrumbs: chain.map(({ id, name }) => ({ id, name })),
    items, ...(body.nextPageToken ? { nextPageToken: body.nextPageToken } : {}),
  };
  remember(listings, key, { data, expires: Date.now() + TTL });
  return data;
}

export async function photoImage(id: string, variant: string, download: boolean, path?: string[]) {
  if (!['thumbnail', 'original'].includes(variant)) throw new DriveError('invalid_request', 400);
  const api = session();
  // Membership proofs share the documented 60-second metadata cache lifetime.
  const chain = await api.authorize(validateId(id), false, path);
  const file = chain[chain.length - 1];
  if (!IMAGE_MIMES.includes(file.mimeType)) throw new DriveError('invalid_request', 400);
  let upstream: Response | undefined;
  if (variant === 'thumbnail' && !download && file.thumbnailLink) {
    try { upstream = await googleImageRequest(file.thumbnailLink); } catch { /* Expired/missing thumbnails fall back to original bytes. */ }
  }
  if (!upstream) {
    upstream = await driveRequest(api.config, `files/${encodeURIComponent(id)}`, { alt: 'media' }, api.keys);
    if (upstream.status >= 300 && upstream.status < 400) {
      const location = upstream.headers.get('location');
      await upstream.body?.cancel();
      if (!location) throw new DriveError('unavailable', 502);
      upstream = await googleImageRequest(location);
    }
  }
  const type = upstream.headers.get('content-type')?.split(';')[0];
  if (!upstream.body || (type && type !== 'application/octet-stream' && !IMAGE_MIMES.includes(type))) {
    await upstream.body?.cancel(); throw new DriveError('unavailable', 502);
  }
  const name = file.name.replace(/[\x00-\x1f\x7f"\\/]/g, '_');
  const encoded = encodeURIComponent(name).replace(/['()*]/g, char => `%${char.charCodeAt(0).toString(16)}`);
  return new Response(upstream.body, { headers: {
    'Content-Type': type && IMAGE_MIMES.includes(type) ? type : file.mimeType,
    'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="photo"; filename*=UTF-8''${encoded}`,
    'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy': "default-src 'none'; sandbox",
  } });
}
