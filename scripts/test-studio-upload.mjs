import { readFile, writeFile, mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const route = ts.transpileModule(await readFile(new URL('../app/api/studio/upload/route.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText.replace("'next/server'", JSON.stringify(pathToFileURL(require.resolve('next/server.js')).href))
  .replace("'@/lib/google-drive.mjs'", JSON.stringify(new URL('../lib/google-drive.mjs', import.meta.url).href));
const originalEntries = JSON.parse(await readFile(new URL('../data/showcase.json', import.meta.url), 'utf8'));
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aHqkAAAAASUVORK5CYII=', 'base64');

test('Studio persists only a poster and link in development; production and invalid writes stay blocked', async () => {
  const originalDirectory = process.cwd(), originalMode = process.env.NODE_ENV;
  const tempRoot = resolve(tmpdir());
  const fixture = await mkdtemp(join(tempRoot, 'capimaso-studio-test-'));
  try {
    await mkdir(join(fixture, 'data'));
    const manifest = join(fixture, 'data', 'showcase.json');
    await writeFile(manifest, JSON.stringify(originalEntries));
    process.chdir(fixture);
    const { POST } = await import(`data:text/javascript;base64,${Buffer.from(route).toString('base64')}`);
    function request({ origin = 'http://localhost:3000', video = originalEntries.find(item => item.format === 'short').video, cover = new File([png], 'poster.png', { type: 'image/png' }) } = {}) {
      const body = new FormData(); body.set('title', 'Teste de cadastro isolado'); body.set('video', video); body.set('cover', cover);
      return new Request('http://localhost:3000/api/studio/upload', { method: 'POST', headers: { origin }, body });
    }
    process.env.NODE_ENV = 'production';
    assert.equal((await POST(request())).status, 403);
    process.env.NODE_ENV = 'development';
    assert.equal((await POST(request({ origin: 'https://outside.example' }))).status, 403);
    assert.equal((await POST(request({ video: 'https://drive.google.com/drive/folders/not-a-file' }))).status, 400);
    assert.equal((await POST(request({ cover: new File(['invalid'], 'poster.png', { type: 'image/png' }) }))).status, 400);
    assert.deepEqual(JSON.parse(await readFile(manifest, 'utf8')), originalEntries);
    const response = await POST(request()); assert.equal(response.status, 201);
    const { entry } = await response.json();
    assert.equal(entry.format, 'short'); assert.match(entry.thumbnail, /^\/images\/posters\/.+\.png$/);
    const saved = JSON.parse(await readFile(manifest, 'utf8'));
    assert.deepEqual(saved, [entry, ...originalEntries]);
    const posters = await readdir(join(fixture, 'public/images/posters'));
    assert.equal(posters.length, 1);
    assert.deepEqual(await readFile(join(fixture, 'public/images/posters', posters[0])), png);
    assert.deepEqual(await readdir(join(fixture, 'public/images')), ['posters']);
    assert.deepEqual(await readdir(join(fixture, 'data')), ['showcase.json']);
    process.env.NODE_ENV = 'production';
    assert.equal((await POST(request())).status, 403);
    assert.deepEqual(JSON.parse(await readFile(manifest, 'utf8')), saved);
  } finally {
    process.chdir(originalDirectory);
    if (originalMode === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = originalMode;
    // Verify the absolute target before recursive cleanup on Windows.
    assert.equal(dirname(resolve(fixture)), tempRoot);
    assert(basename(fixture).startsWith('capimaso-studio-test-'));
    await rm(fixture, { recursive: true, force: true });
  }
});
