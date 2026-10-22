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
const reducerSource = compile(await readFile(new URL('../src/os/win7/window-state.ts', import.meta.url), 'utf8'));
const { windowReducer: reduce, initialWindows, activeWindow, fitBounds } = await import(moduleURL(reducerSource.replace("'./types'", JSON.stringify(typesURL))));
const area = { width: 1440, height: 860 };
const open = (state, id) => reduce(state, { type: 'open', id, area });

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
