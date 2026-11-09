import { streamVideo } from '@/src/server/drive/videos';
import { errorResponse } from '@/src/server/drive/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  try { return await streamVideo((await context.params).id, request); }
  catch (error) { return errorResponse(error); }
}
export async function HEAD(request: Request, context: Context) {
  try { return await streamVideo((await context.params).id, request, true); }
  catch (error) {
    const response = errorResponse(error);
    return new Response(null, { status: response.status, headers: response.headers });
  }
}
