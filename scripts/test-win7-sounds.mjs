import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import ts from 'typescript';

const moduleURL = text => `data:text/javascript;base64,${Buffer.from(text).toString('base64')}`;
const compile = async path => ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2017 },
}).outputText;
const mapURL = moduleURL(await compile('../src/lib/sounds-map.ts'));
const { SoundManager } = await import(moduleURL((await compile('../src/os/win7/sound-manager.ts')).replace("'@/src/lib/sounds-map'", JSON.stringify(mapURL))));
const { availableWin7Sounds } = await import(moduleURL((await compile('../src/server/win7-sounds.ts'))
  .replace("import 'server-only';", '').replace("'@/src/lib/sounds-map'", JSON.stringify(mapURL))));

function fixture(available, reject = false) {
  const tracks = [];
  const manager = new SoundManager(available, src => {
    const track = { src, currentTime: 7, plays: 0, pauses: 0, released: false, volume: 0,
      pause() { this.pauses++; }, play() { this.plays++; return reject ? Promise.reject(Error('autoplay denied')) : Promise.resolve(); },
      removeAttribute() { this.released = true; }, load() {}, onerror: null };
    tracks.push(track); return track;
  });
  return { manager, tracks };
}

test('missing files and pre-interaction calls produce no media elements or requests', () => {
  const { manager, tracks } = fixture(['logon']);
  manager.play('logon'); assert.equal(tracks.length, 0);
  manager.enable(); manager.play('startup'); manager.play('navigation'); assert.equal(tracks.length, 0);
});
test('every event maps to the real local filename and replay starts at zero', () => {
  const names = ['logon', 'startup', 'navigation', 'minimize', 'error'];
  const { manager, tracks } = fixture(names); manager.enable();
  for (const name of names) manager.play(name);
  assert.deepEqual(tracks.map(track => track.src), [
    '/assets/win7/sounds/Windows Logon Sound.wav',
    '/assets/win7/sounds/Windows Startup.wav',
    '/assets/win7/sounds/Windows Navigation Start.wav',
    '/assets/win7/sounds/Windows Minimize.wav',
    '/assets/win7/sounds/Windows Error.wav',
  ]);
  assert(tracks.every(track => track.currentTime === 0 && track.volume === .4));
  manager.play('navigation'); assert.equal(tracks[2].plays, 2); assert.equal(tracks.length, 5);
});
test('autoplay rejection and unavailable media stay silent; disposal stops playback', async () => {
  const { manager, tracks } = fixture(['logon'], true); manager.enable(); manager.play('logon');
  await new Promise(resolve => setImmediate(resolve));
  tracks[0].onerror(); manager.play('logon'); assert.equal(tracks[0].plays, 1);
  manager.dispose(); assert.equal(tracks[0].released, true); assert.equal(tracks[0].onerror, null);
  manager.play('logon'); assert.equal(tracks.length, 1);
});
test('consecutive errors do not create an overlapping error storm', () => {
  const { manager, tracks } = fixture(['error']); manager.enable();
  for (let index = 0; index < 30; index++) manager.play('error');
  assert.equal(tracks.length, 1); assert.equal(tracks[0].plays, 1);
});

test('global mute stops existing audio and blocks all events until unmuted', () => {
  const { manager, tracks } = fixture(['logon', 'navigation']);
  let changes = 0;
  const unsubscribe = manager.subscribe(() => { changes++; });
  manager.enable(); manager.play('logon');
  const pauses = tracks[0].pauses;
  manager.setMuted(true);
  assert.equal(manager.getMuted(), true);
  assert.equal(tracks[0].muted, true);
  assert(tracks[0].pauses > pauses);
  manager.play('navigation'); manager.play('logon');
  assert.equal(tracks.length, 1); assert.equal(tracks[0].plays, 1);
  manager.setMuted(true); assert.equal(changes, 1);
  manager.setMuted(false); manager.play('logon'); manager.play('navigation');
  assert.equal(tracks[0].muted, false); assert.equal(tracks[0].plays, 2);
  assert.equal(tracks.length, 2); assert.equal(changes, 2);
  unsubscribe(); manager.setMuted(true); assert.equal(changes, 2);
});

test('server and player agree on shipped original files', async () => {
  assert.deepEqual(availableWin7Sounds().sort(), ['error', 'logon', 'minimize', 'navigation', 'startup']);
  const { manager, tracks } = fixture(availableWin7Sounds()); manager.enable();
  for (const event of availableWin7Sounds()) manager.play(event);
  for (const track of tracks) {
    const bytes = await readFile(path.join(process.cwd(), 'public', track.src));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WAVE');
  }
});

test('absent root files stay silent; themes and directories are not mistaken for mapped audio', async () => {
  const publicDirectory = await mkdtemp(path.join(tmpdir(), 'capimaso-sounds-'));
  try {
    const root = path.join(publicDirectory, 'assets/win7/sounds');
    await mkdir(path.join(root, 'Sonata'), { recursive: true });
    await writeFile(path.join(root, 'Sonata/Windows Logon Sound.wav'), 'theme');
    await mkdir(path.join(root, 'Windows Error.wav'));
    await writeFile(path.join(root, 'Windows Navigation Start.wav'), 'root');
    assert.deepEqual(availableWin7Sounds(publicDirectory), ['navigation']);
    const { manager, tracks } = fixture(availableWin7Sounds(publicDirectory)); manager.enable();
    manager.play('logon'); manager.play('error'); assert.equal(tracks.length, 0);
    manager.play('navigation'); assert.equal(tracks.length, 1);
  } finally {
    if (!path.resolve(publicDirectory).startsWith(path.resolve(tmpdir()) + path.sep + 'capimaso-sounds-')) throw Error('Unexpected temporary sound directory');
    await rm(publicDirectory, { recursive: true, force: true });
  }
});
