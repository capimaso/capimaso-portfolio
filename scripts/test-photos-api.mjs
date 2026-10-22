import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';

const asModule = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
async function compile(path, imports = {}) {
  let code = ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2017 },
  }).outputText.replace(/import ['"]server-only['"];?/g, '');
  for (const [name, url] of Object.entries(imports)) code = code.replaceAll(`'${name}'`, JSON.stringify(url));
  return asModule(code);
}
const clientURL = await compile('../src/server/drive/client.ts');
const galleryURL = await compile('../src/server/drive/gallery.ts', { './client': clientURL });
const imports = { '@/src/server/drive/client': clientURL, '@/src/server/drive/gallery': galleryURL };
const { GET: list } = await import(await compile('../app/api/photos/route.ts', imports));
const { GET: image } = await import(await compile('../app/api/photos/[id]/image/route.ts', imports));
const { driveConfig } = await import(clientURL);
const folderMime = 'application/vnd.google-apps.folder';
const envNames = ['DRIVE_FOLDER_ID', 'GOOGLE_DRIVE_API_KEY', 'DRIVE_FOLDER_RESOURCE_KEY'];
const fakeKey = 'test_key_without_real_credentials';
let sequence = 0;

async function fixture(run, options = {}) {
  const oldEnv = envNames.map(name => process.env[name]), oldFetch = globalThis.fetch;
  const root = `test_root_${++sequence}`;
  process.env.DRIVE_FOLDER_ID = root;
  process.env.GOOGLE_DRIVE_API_KEY = fakeKey;
  delete process.env.DRIVE_FOLDER_RESOURCE_KEY;
  const calls = [];
  const files = {
    [root]: { id: root, name: 'My photos', mimeType: folderMime },
    album: { id: 'album', name: 'Album', mimeType: folderMime, parents: [root] },
    photo: { id: 'photo', name: 'Foto ç.jpg', mimeType: 'image/jpeg', parents: ['album'], thumbnailLink: 'https://lh3.googleusercontent.com/test-thumbnail' },
    outside: { id: 'outside', name: 'Other public photo', mimeType: 'image/jpeg', parents: ['unrelated'] },
    unrelated: { id: 'unrelated', name: 'Other root', mimeType: folderMime },
    svg: { id: 'svg', name: 'active.svg', mimeType: 'image/svg+xml', parents: [root] },
    ...options.files,
  };
  globalThis.fetch = async (url, init) => {
    const u = new URL(url); calls.push({ url: u, init });
    assert(!u.searchParams.has('key'));
    if (options.respond) { const response = await options.respond(u, init); if (response) return response; }
    if (u.hostname === 'lh3.googleusercontent.com') {
      assert(!init.headers?.['X-Goog-Api-Key']);
      return new Response('thumbnail bytes', { headers: { 'Content-Type': 'image/jpeg' } });
    }
    assert.equal(u.hostname, 'www.googleapis.com');
    assert.equal(init.headers['X-Goog-Api-Key'], fakeKey);
    if (u.pathname.endsWith('/files')) {
      const parent = u.searchParams.get('q').match(/^'([^']+)' in parents/)[1];
      const filtered = Object.values(files).filter(file => file.parents?.includes(parent)
        && (!u.searchParams.get('q').includes('mimeType') || file.mimeType !== 'image/svg+xml'));
      return Response.json({ files: filtered, ...(parent === root ? { nextPageToken: 'second-page' } : {}) });
    }
    if (u.searchParams.get('alt') === 'media') return new Response('original bytes', { headers: { 'Content-Type': 'image/jpeg' } });
    const id = u.pathname.split('/').at(-1);
    return files[id] ? Response.json(files[id]) : Response.json({ error: {} }, { status: 404 });
  };
  try { await run({ root, calls, files }); }
  finally {
    globalThis.fetch = oldFetch;
    envNames.forEach((name, index) => { if (oldEnv[index] === undefined) delete process.env[name]; else process.env[name] = oldEnv[index]; });
  }
}

test('folder links normalize on server; listing exposes only the public contract', () => fixture(async ({ root, calls }) => {
  process.env.DRIVE_FOLDER_ID = `https://drive.google.com/drive/folders/${root}?resourcekey=public_resource_key`;
  assert.equal(driveConfig().root, root);
  const response = await list(new Request('http://local/api/photos'));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body.items, [{ id: 'album', name: 'Album', kind: 'folder', mimeType: folderMime }]);
  assert.equal(body.nextPageToken, 'second-page');
  assert(!JSON.stringify(body).includes(fakeKey));
  assert(!JSON.stringify(body).includes('thumbnailLink'));
  assert(calls.every(call => call.init.headers['X-Goog-Drive-Resource-Keys'].includes(`${root}/public_resource_key`)));
  await list(new Request('http://local/api/photos?pageToken=second-page'));
  assert(calls.some(call => call.url.searchParams.get('pageToken') === 'second-page'));
}));

test('outside-root images are rejected before any binary fetch', () => fixture(async ({ calls }) => {
  const response = await image(new Request('http://local/api/photos/outside/image'), { params: Promise.resolve({ id: 'outside' }) });
  assert.equal(response.status, 403);
  assert(!calls.some(call => call.url.searchParams.get('alt') === 'media'));
}));

test('proxy preserves original bytes and safe Unicode attachment filename', () => fixture(async () => {
  const response = await image(new Request('http://local/api/photos/photo/image?download=1'), { params: Promise.resolve({ id: 'photo' }) });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'original bytes');
  assert(response.headers.get('Content-Disposition').includes("attachment; filename=\"photo\"; filename*=UTF-8''Foto%20%C3%A7.jpg"));
  assert.equal(response.headers.get('Content-Type'), 'image/jpeg');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
}));

test('thumbnails stay behind the proxy without forwarding API key to media host', () => fixture(async () => {
  const response = await image(new Request('http://local/api/photos/photo/image?variant=thumbnail'), { params: Promise.resolve({ id: 'photo' }) });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'thumbnail bytes');
}));

test('invalid IDs, variants and active image formats are rejected', () => fixture(async () => {
  for (const [id, query] of [['bad/id', ''], ['photo', '?variant=arbitrary'], ['svg', '']]) {
    const response = await image(new Request(`http://local/api/photos/file/image${query}`), { params: Promise.resolve({ id }) });
    assert.equal(response.status, 400);
  }
}));

test('cold-instance paths work when public metadata omits parents, but invented paths do not', () => fixture(async ({ root }) => {
  const response = await image(new Request(`http://local/api/photos/photo/image?path=${root}/album`), { params: Promise.resolve({ id: 'photo' }) });
  assert.equal(response.status, 200);
  const bad = await image(new Request(`http://local/api/photos/outside/image?path=${root}/album`), { params: Promise.resolve({ id: 'outside' }) });
  assert.equal(bad.status, 403);
}));

test('missing configuration and quota failures return sanitized codes', async () => {
  await fixture(async () => {
    delete process.env.GOOGLE_DRIVE_API_KEY;
    const response = await list(new Request('http://local/api/photos'));
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: { code: 'not_configured' } });
  });
  await fixture(async () => {
    const response = await list(new Request('http://local/api/photos'));
    assert.equal(response.status, 429);
    const body = JSON.stringify(await response.json());
    assert(body.includes('rate_limited')); assert(!body.includes(fakeKey));
  }, { respond: () => Response.json({ error: { message: fakeKey, errors: [{ reason: 'userRateLimitExceeded' }] } }, { status: 403 }) });
});
