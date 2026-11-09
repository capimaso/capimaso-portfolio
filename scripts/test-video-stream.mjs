import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';

const moduleURL = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
async function compile(path, imports = {}, suffix = '') {
  let source = ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText.replace(/import ['"]server-only['"];?/g, '');
  for (const [name, value] of Object.entries(imports)) source = source.replaceAll(`'${name}'`, JSON.stringify(value));
  return moduleURL(source + suffix);
}
const client = await compile('../src/server/drive/client.ts');
const parser = moduleURL(await readFile(new URL('../lib/google-drive.mjs', import.meta.url), 'utf8'));
const catalog = moduleURL(`export default ${JSON.stringify([
  { id: 'short', format: 'short', video: 'https://drive.google.com/file/d/public_file/view?resourcekey=public_resource' },
  { id: 'long', format: 'long', video: 'https://www.youtube.com/watch?v=abcdefghijk' },
  { id: 'external', format: 'short', video: 'https://example.com/file.mp4' },
])}`);
let instance = 0;

async function fixture(run, options = {}) {
  const previous = globalThis.fetch, previousKey = process.env.GOOGLE_DRIVE_API_KEY;
  process.env.GOOGLE_DRIVE_API_KEY = 'fixture_key_not_a_real_credential';
  const service = await compile('../src/server/drive/videos.ts', {
    '@/data/showcase.json': catalog, '@/lib/google-drive.mjs': parser, './client': client,
  }, `\n// instance ${instance++}`);
  const { GET, HEAD } = await import(await compile('../app/api/videos/[id]/stream/route.ts', {
    '@/src/server/drive/videos': service, '@/src/server/drive/client': client,
  }));
  const calls = [], size = options.size || 10_000_000;
  globalThis.fetch = async (input, init) => {
    const url = new URL(input); calls.push({ url, init });
    assert.equal(url.hostname, 'www.googleapis.com');
    assert.equal(url.pathname, '/drive/v3/files/public_file');
    assert(!url.searchParams.has('key'));
    assert.equal(init.headers['X-Goog-Api-Key'], 'fixture_key_not_a_real_credential');
    assert.equal(init.headers['X-Goog-Drive-Resource-Keys'], 'public_file/public_resource');
    assert.equal(init.redirect, 'manual');
    assert(init.signal instanceof AbortSignal);
    if (options.respond) { const response = await options.respond(url, init); if (response) return response; }
    if (url.searchParams.get('alt') !== 'media') return Response.json({
      id: 'public_file', mimeType: 'video/mp4', size: String(size), capabilities: { canDownload: true }, ...options.metadata,
    });
    const range = init.headers.Range?.match(/^bytes=(\d+)-(\d+)$/);
    const length = range ? Number(range[2]) - Number(range[1]) + 1 : size;
    return new Response(new Uint8Array(length), { status: range ? 206 : 200, headers: {
      'Content-Type': 'video/mp4', 'Content-Length': String(length),
      ...(range ? { 'Content-Range': `bytes ${range[1]}-${range[2]}/${size}` } : {}),
      'X-Goog-Api-Key': 'must_not_be_forwarded', 'Set-Cookie': 'must_not_be_forwarded',
    } });
  };
  const request = (range, id = 'short', head = false) => (head ? HEAD : GET)(new Request('https://portfolio.test/api/videos/x/stream', {
    method: head ? 'HEAD' : 'GET', ...(range === undefined ? {} : { headers: { Range: range } }),
  }), { params: Promise.resolve({ id }) });
  try { await run({ request, calls, size }); }
  finally { globalThis.fetch = previous; if (previousKey === undefined) delete process.env.GOOGLE_DRIVE_API_KEY; else process.env.GOOGLE_DRIVE_API_KEY = previousKey; }
}

test('only catalog shorts are accepted, before configuration or upstream access', () => fixture(async ({ request, calls }) => {
  delete process.env.GOOGLE_DRIVE_API_KEY;
  for (const id of ['outside', 'public_file', 'long', 'external', '../short', 'https://example.com']) {
    assert.equal((await request('bytes=0-9', id)).status, 404);
  }
  assert.equal(calls.length, 0);
}));

test('missing server key produces a safe error and no provider request', () => fixture(async ({ request, calls }) => {
  delete process.env.GOOGLE_DRIVE_API_KEY;
  const response = await request('bytes=0-9');
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: { code: 'not_configured' } });
  assert.equal(calls.length, 0);
}));

test('partial response preserves byte positions and never exposes credentials or provider headers', () => fixture(async ({ request, calls, size }) => {
  const response = await request('bytes=1200-2223');
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('content-range'), `bytes 1200-2223/${size}`);
  assert.equal(response.headers.get('content-length'), '1024');
  assert.equal(response.headers.get('content-type'), 'video/mp4');
  assert.equal(response.headers.get('accept-ranges'), 'bytes');
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert(!response.headers.has('x-goog-api-key'));
  assert(!response.headers.has('set-cookie'));
  assert.equal((await response.arrayBuffer()).byteLength, 1024);
  assert.equal(calls.length, 2);
}));

test('open and suffix ranges are bounded; distant seeks keep their true offsets', () => fixture(async ({ request, size }) => {
  const ranges = [['bytes=0-', 0, 4 * 1024 * 1024 - 1], ['bytes=8000000-', 8000000, size - 1], ['bytes=-100', size - 100, size - 1]];
  for (const [header, first, last] of ranges) {
    const response = await request(header);
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('content-range'), `bytes ${first}-${last}/${size}`);
    assert.equal(Number(response.headers.get('content-length')), last - first + 1);
    await response.body.cancel();
  }
}));

test('HEAD uses cached metadata and does not download binary content', () => fixture(async ({ request, calls, size }) => {
  for (let index = 0; index < 2; index++) {
    const response = await request(undefined, 'short', true);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-length'), String(size));
    assert.equal(await response.text(), '');
  }
  assert.equal(calls.length, 1);
  assert(!calls[0].url.searchParams.has('alt'));
}));

test('malformed, multi-part and unsatisfiable ranges return 416 before a binary request', () => fixture(async ({ request, calls, size }) => {
  for (const range of ['bytes=10-9', 'bytes=-0', 'bytes=-', 'bytes=0-1,3-5', `bytes=${size}-`, 'bytes=999999999999999999999-', 'items=0-9']) {
    const response = await request(range);
    assert.equal(response.status, 416, range);
    assert.equal(response.headers.get('content-range'), `bytes */${size}`);
  }
  assert.equal(calls.length, 1);
}));

test('non-video, unavailable downloads and invalid metadata never reach binary download', async () => {
  for (const metadata of [{ mimeType: 'text/html' }, { capabilities: { canDownload: false } }, { trashed: true }, { id: 'another_file' }, { size: 'invalid' }]) {
    await fixture(async ({ request, calls }) => {
      const response = await request('bytes=0-9');
      assert([403, 502].includes(response.status));
      assert.equal(calls.length, 1);
    }, { metadata });
  }
});

test('HTML, redirects, mismatched byte ranges and ignored ranges are rejected', async () => {
  for (const [status, headers] of [[200, { 'Content-Type': 'text/html' }], [302, { Location: 'https://example.com' }],
    [200, { 'Content-Type': 'video/mp4' }], [206, { 'Content-Type': 'video/mp4', 'Content-Range': 'bytes 0-9/999' }]]) {
    await fixture(async ({ request }) => { assert.equal((await request('bytes=0-9')).status, 502); }, {
      respond(url) { if (url.searchParams.get('alt') === 'media') return new Response('not-video', { status, headers }); },
    });
  }
});

test('provider errors stay sanitized and do not expose the key or a challenge page', async () => {
  for (const [type, expected] of [['text/html', 429], ['application/json', 403]]) {
    await fixture(async ({ request }) => {
      const response = await request('bytes=0-9'); assert.equal(response.status, expected);
      assert(!JSON.stringify(await response.json()).includes('fixture_key'));
    }, { respond() { return new Response(type === 'text/html' ? 'challenge fixture_key' : '{"error":{}}', { status: 403, headers: { 'Content-Type': type } }); } });
  }
});

test('a normal non-range GET streams the original body without a disk copy', () => fixture(async ({ request }) => {
  const response = await request();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-length'), '32');
  assert.equal((await response.arrayBuffer()).byteLength, 32);
}, { size: 32 }));
