import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';

// Use the project's TypeScript compiler, without a test framework or generated files.
const compile = source => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2017 },
}).outputText;
const moduleURL = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const typesURL = moduleURL(compile(await readFile(new URL('../src/os/win7/types.ts', import.meta.url), 'utf8')));
const geometryURL = moduleURL(compile(await readFile(new URL('../src/os/win7/window-geometry.ts', import.meta.url), 'utf8')));
const { gestureBounds } = await import(geometryURL);
const catalogURL = moduleURL(compile(await readFile(new URL('../src/os/win7/program-catalog.ts', import.meta.url), 'utf8')).replace("'./types'", JSON.stringify(typesURL)));
const { searchPrograms } = await import(catalogURL);
const reducerSource = compile(await readFile(new URL('../src/os/win7/window-state.ts', import.meta.url), 'utf8'));
const { windowReducer: reduce, initialWindows, activeWindow, fitBounds } = await import(moduleURL(reducerSource.replaceAll("'./window-geometry'", JSON.stringify(geometryURL)).replace("'./types'", JSON.stringify(typesURL))));
const area = { width: 1440, height: 860 };
const open = (state, id) => reduce(state, { type: 'open', id, area });

test('media destinations restore one viewer and preserve geometry without changing the photo viewer', () => {
  let state = reduce(initialWindows, { type: 'open', id: 'videoPlayer', area, media: { kind: 'video', id: 'scarface' } });
  const bounds = { x: 80, y: 60, width: 700, height: 520 };
  state = reduce(state, { type: 'bounds', id: 'videoPlayer', bounds });
  state = reduce(state, { type: 'minimize', id: 'videoPlayer' });
  state = reduce(state, { type: 'open', id: 'videoPlayer', area, media: { kind: 'video', id: 'megluuh' } });
  assert.equal(state.windows.length, 1);
  assert.equal(state.windows[0].minimized, false);
  assert.deepEqual(state.windows[0].bounds, bounds);
  assert.deepEqual(state.windows[0].media, { kind: 'video', id: 'megluuh' });
  const selection = { images: [{ id: 'photo' }], index: 0, path: [] };
  state = reduce(state, { type: 'open', id: 'photoViewer', area, selection });
  state = reduce(state, { type: 'open', id: 'thumbnailViewer', area, media: { kind: 'thumbnail', src: '/images/thumbs/ThumbBizu.png' } });
  state = reduce(state, { type: 'open', id: 'thumbnailViewer', area, media: { kind: 'thumbnail', src: '/images/thumbs/another.png' } });
  assert.equal(state.windows.length, 3);
  assert.deepEqual(state.windows.find(win => win.id === 'photoViewer').selection, selection);
  assert.equal(state.windows.find(win => win.id === 'thumbnailViewer').media.src, '/images/thumbs/another.png');
});

test('portfolio folders are searchable in both languages and cancelled games are absent', () => {
  for (const query of ['vídeos', 'videos', 'curtos', 'longos', 'shorts']) assert.equal(searchPrograms(query, value => value)[0].id, 'videos');
  for (const query of ['thumbnails', 'thumbs', 'miniaturas']) assert.equal(searchPrograms(query, value => value)[0].id, 'thumbnails');
  for (const query of ['games', 'jogos', 'solitaire', 'purble']) assert.deepEqual(searchPrograms(query, value => value, true), []);
  assert.equal(searchPrograms('', value => value, true).some(app => ['videoPlayer', 'thumbnailViewer'].includes(app.id)), false);
});

test('opening an existing app restores and focuses a single window', () => {
  let state = open(open(initialWindows, 'photos'), 'contact');
  state = reduce(state, { type: 'minimize', id: 'photos' });
  state = open(state, 'photos');
  assert.equal(state.windows.length, 2);
  assert.equal(activeWindow(state.windows), 'photos');
  assert.equal(state.windows.find(win => win.id === 'photos').minimized, false);
});

test('maximize and restore preserve the original rectangle', () => {
  const state = open(initialWindows, 'photos');
  const maximized = reduce(state, { type: 'maximize', id: 'photos' });
  assert.equal(maximized.windows[0].maximized, true);
  assert.deepEqual(maximized.windows[0].bounds, state.windows[0].bounds);
  assert.deepEqual(reduce(maximized, { type: 'maximize', id: 'photos' }), state);
});

test('taskbar minimizes the foreground window and restores background windows', () => {
  let state = open(open(initialWindows, 'photos'), 'about');
  state = reduce(state, { type: 'task', id: 'about' });
  assert.equal(activeWindow(state.windows), 'photos');
  state = reduce(state, { type: 'task', id: 'about' });
  assert.equal(activeWindow(state.windows), 'about');
  assert.equal(state.windows.length, 2);
});

test('show desktop restores only previously visible windows', () => {
  let state = open(open(open(initialWindows, 'photos'), 'about'), 'contact');
  state = reduce(state, { type: 'minimize', id: 'photos' });
  state = reduce(state, { type: 'desktop' });
  assert.equal(activeWindow(state.windows), undefined);
  state = reduce(state, { type: 'desktop' });
  assert.equal(state.windows.find(win => win.id === 'photos').minimized, true);
  assert.equal(state.windows.find(win => win.id === 'about').minimized, false);
  assert.equal(state.windows.find(win => win.id === 'contact').minimized, false);
});

test('closing during show desktop does not resurrect the closed window', () => {
  let state = reduce(open(initialWindows, 'photos'), { type: 'desktop' });
  state = reduce(state, { type: 'close', id: 'photos' });
  assert.deepEqual(reduce(state, { type: 'desktop' }), initialWindows);
});

test('rectangles stay reachable after a workspace shrinks', () => {
  const rect = fitBounds({ x: 900, y: 700, width: 820, height: 560 }, { width: 768, height: 400 });
  assert.deepEqual(rect, { x: 0, y: 0, width: 768, height: 400 });
  assert.deepEqual(fitBounds({ x: -20, y: -10, width: 1, height: 1 }, area), { x: 0, y: 0, width: 320, height: 200 });
});

test('opening another photograph updates the existing viewer without losing its geometry', () => {
  const first = { images: [{ id: 'a' }], index: 0, folder: { id: 'album' }, path: ['root', 'album'] };
  const second = { ...first, images: [{ id: 'b' }] };
  let state = reduce(initialWindows, { type: 'open', id: 'photoViewer', area, selection: first });
  const bounds = state.windows[0].bounds;
  state = reduce(state, { type: 'minimize', id: 'photoViewer' });
  state = reduce(state, { type: 'open', id: 'photoViewer', area, selection: second });
  assert.equal(state.windows.length, 1);
  assert.equal(state.windows[0].selection, second);
  assert.equal(state.windows[0].minimized, false);
  assert.deepEqual(state.windows[0].bounds, bounds);
});

test('resizing each edge preserves opposite edges and obeys minimum sizes and work area', () => {
  const bounds = { x: 120, y: 100, width: 640, height: 450 };
  for (const direction of ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']) {
    for (const delta of [-10000, -23, 40, 10000]) {
      const rect = gestureBounds(bounds, area, delta, delta, direction);
      assert(rect.x >= 0 && rect.y >= 0 && rect.width >= 320 && rect.height >= 200);
      assert(rect.x + rect.width <= area.width && rect.y + rect.height <= area.height);
      if (!direction.includes('w')) assert.equal(rect.x, bounds.x);
      if (!direction.includes('n')) assert.equal(rect.y, bounds.y);
      if (!direction.includes('e')) assert.equal(rect.x + rect.width, bounds.x + bounds.width);
      if (!direction.includes('s')) assert.equal(rect.y + rect.height, bounds.y + bounds.height);
    }
  }
});

test('focus is idempotent; arbitrarily many focus changes keep one entry per window', () => {
  let state = open(open(initialWindows, 'photos'), 'about');
  assert.equal(reduce(state, { type: 'focus', id: 'about' }), state);
  for (let index = 0; index < 2000; index++) state = reduce(state, { type: 'focus', id: index % 2 ? 'photos' : 'about' });
  assert.equal(state.windows.length, 2);
  assert.equal(new Set(state.windows.map(win => win.id)).size, 2);
  assert.equal(activeWindow(state.windows), 'photos');
});

test('late gesture frames cannot overwrite minimized or maximized restore geometry', () => {
  const state = open(initialWindows, 'photos');
  for (const type of ['minimize', 'maximize']) {
    const changed = reduce(state, { type, id: 'photos' });
    const late = reduce(changed, { type: 'bounds', id: 'photos', bounds: { x: 0, y: 0, width: 321, height: 201 } });
    assert.deepEqual(late.windows[0].bounds, state.windows[0].bounds);
  }
  assert.equal(reduce(state, { type: 'bounds', id: 'photos', bounds: { x: NaN, y: 0, width: 320, height: 200 } }), state);
});

test('program search matches bilingual names, accents and aliases without adding unavailable apps', () => {
  const t = label => ({ Calculadora: 'Calculator', 'Bloco de notas': 'Notepad', Fotografias: 'Photographs' })[label] || label;
  for (const query of ['calc', 'Calculadora', 'calculator']) assert.equal(searchPrograms(query, t)[0].id, 'calculator');
  for (const query of ['NOTEPAD', 'bloco de notas', 'texto']) assert.equal(searchPrograms(query, t)[0].id, 'notepad');
  for (const query of ['fotógrafias', 'bibliotecas', 'photos']) assert.equal(searchPrograms(query, t)[0].id, 'photos');
  assert.equal(searchPrograms('', t).some(app => app.id === 'calculator'), false);
  assert.equal(searchPrograms('', t, true).some(app => app.id === 'calculator'), true);
  assert.deepEqual(searchPrograms('nonexistent program', t, true), []);
});

test('minimization records its visual destination and show desktop preserves already hidden apps', () => {
  let state = open(open(initialWindows, 'about'), 'photos');
  state = reduce(state, { type: 'minimize', id: 'about' });
  assert.equal(state.windows.find(win => win.id === 'about').minimizeTarget, 'taskbar');
  state = reduce(state, { type: 'desktop' });
  assert.equal(state.windows.find(win => win.id === 'about').minimizeTarget, 'taskbar');
  assert.equal(state.windows.find(win => win.id === 'photos').minimizeTarget, 'taskbar');
  state = reduce(state, { type: 'desktop' });
  assert.equal(state.windows.find(win => win.id === 'about').minimized, true);
  assert.equal(state.windows.find(win => win.id === 'photos').minimized, false);
  state = reduce(state, { type: 'task', id: 'photos' });
  assert.equal(state.windows.find(win => win.id === 'photos').minimizeTarget, 'taskbar');
});

test('opening a Drive search destination restores the existing Explorer and preserves geometry', () => {
  let state = open(initialWindows, 'photos');
  const original = state.windows[0].bounds;
  state = reduce(state, { type: 'minimize', id: 'photos' });
  const folder = [{ id: 'root', name: 'Photos' }, { id: 'album', name: 'Café' }];
  state = reduce(state, { type: 'open', id: 'photos', area, folder });
  assert.equal(state.windows.length, 1);
  assert.equal(state.windows[0].folder, folder);
  assert.deepEqual(state.windows[0].bounds, original);
  assert.equal(state.windows[0].minimized, false);
  assert.equal(activeWindow(state.windows), 'photos');
});
