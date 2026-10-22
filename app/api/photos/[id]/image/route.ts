import { photoImage } from '@/src/server/drive/gallery';
import { errorResponse, parsePath } from '@/src/server/drive/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const params = new URL(request.url).searchParams;
    return await photoImage(id, params.get('variant') || 'original', params.get('download') === '1', parsePath(params.get('path')));
  } catch (error) { return errorResponse(error); }
}
