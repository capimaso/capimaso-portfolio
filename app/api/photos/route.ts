import { listPhotos } from '@/src/server/drive/gallery';
import { errorResponse, parsePath } from '@/src/server/drive/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const data = await listPhotos(params.get('folderId') || undefined, params.get('pageToken') || undefined, params.get('refresh') === '1', parsePath(params.get('path')));
    return Response.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return errorResponse(error); }
}
