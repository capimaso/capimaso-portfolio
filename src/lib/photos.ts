/** Public gallery contract. Credentials and provider thumbnail URLs stay on the server. */
export type PhotoFolder = { id: string; name: string };
export type PhotoItem = {
  id: string;
  name: string;
  kind: 'folder' | 'image';
  mimeType: string;
  width?: number;
  height?: number;
};
export type PhotoListing = {
  folder: PhotoFolder;
  breadcrumbs: PhotoFolder[];
  items: PhotoItem[];
  nextPageToken?: string;
};
export type PhotoErrorCode = 'not_configured' | 'invalid_request' | 'not_found' | 'access_denied' | 'rate_limited' | 'unavailable';
export type PhotoFailure = { error: { code: PhotoErrorCode } };
export type PhotoSelection = { images: PhotoItem[]; index: number; folder: PhotoFolder; path: string[]; nextPageToken?: string };

export function photoImageURL(id: string, variant: 'thumbnail' | 'original' = 'original', download = false, path: string[] = []) {
  const params = new URLSearchParams({ variant });
  if (download) params.set('download', '1');
  if (path.length) params.set('path', path.join('/'));
  return `/api/photos/${encodeURIComponent(id)}/image?${params}`;
}
