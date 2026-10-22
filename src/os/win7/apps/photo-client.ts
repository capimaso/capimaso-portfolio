import type { PhotoErrorCode, PhotoListing } from '@/src/lib/photos';

export class PhotoRequestError extends Error {
  constructor(public code: PhotoErrorCode) { super(code); }
}
export type PhotoLocation = { id?: string; path?: string[] };
export async function fetchPhotoListing(location: PhotoLocation, options: { token?: string; refresh?: boolean; signal?: AbortSignal } = {}): Promise<PhotoListing> {
  const params = new URLSearchParams();
  if (location.id) params.set('folderId', location.id);
  if (location.path?.length) params.set('path', location.path.join('/'));
  if (options.token) params.set('pageToken', options.token);
  if (options.refresh) params.set('refresh', '1');
  const response = await fetch(`/api/photos?${params}`, { signal: options.signal, cache: 'no-store' });
  const body = await response.json();
  if (!response.ok) throw new PhotoRequestError(body.error?.code || 'unavailable');
  return body as PhotoListing;
}
export function photoErrorMessage(error: unknown) {
  const code = error instanceof PhotoRequestError ? error.code : 'unavailable';
  const messages: Record<PhotoErrorCode, string> = {
    not_configured: 'A galeria ainda não está disponível. Tente novamente mais tarde.',
    invalid_request: 'Não foi possível abrir este endereço. Volte para Fotografias.',
    not_found: 'Esta pasta ou imagem não está mais disponível.',
    access_denied: 'Não foi possível acessar esta pasta ou imagem.',
    rate_limited: 'A galeria está recebendo muitos acessos. Aguarde um pouco e tente novamente.',
    unavailable: 'Não foi possível carregar as fotografias. Verifique sua conexão e tente novamente.',
  };
  return messages[code] || messages.unavailable;
}
