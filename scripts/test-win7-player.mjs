import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';

const moduleURL = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const compile = async file => ts.transpileModule(await readFile(new URL(file, import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const { VideoAudio } = await import(moduleURL(await compile('../src/os/win7/apps/video-audio.ts')));
const soundsMapURL = moduleURL(await compile('../src/lib/sounds-map.ts'));
const { SoundManager } = await import(moduleURL((await compile('../src/os/win7/sound-manager.ts'))
  .replace("'@/src/lib/sounds-map'", JSON.stringify(soundsMapURL))));

function audioTarget(deferred = false) {
  return { volume: 100, muted: false, requestedMute: false,
    setVolume(value) { this.volume = value; }, isMuted() { return this.muted; },
    mute() { this.requestedMute = true; if (!deferred) this.muted = true; },
    unMute() { this.requestedMute = false; if (!deferred) this.muted = false; },
    acknowledge() { this.muted = this.requestedMute; },
  };
}

test('master changes reach connected videos without overwriting their own volumes', () => {
  const master = new SoundManager([]), first = new VideoAudio(master), second = new VideoAudio(master);
  const a = audioTarget(), b = audioTarget();
  first.connect(a, assert.fail); second.connect(b, assert.fail);
  assert.equal(a.muted, true); // muted autoplay
  first.setVolume(50); second.setVolume(20);
  master.setVolume(.5);
  assert.equal(a.volume, 25); assert.equal(b.volume, 10);
  assert.deepEqual(first.snapshot(), { volume: 50, muted: false });
  assert.deepEqual(second.snapshot(), { volume: 20, muted: false });
  master.setVolume(1);
  assert.equal(a.volume, 50); assert.equal(b.volume, 20);
  assert.equal(master.getVolume(), 1);
  first.disconnect(); second.disconnect();
});

test('master mute and zero win over video controls, and restore local preferences', () => {
  const master = new SoundManager([]), mixer = new VideoAudio(master), target = audioTarget();
  mixer.connect(target, assert.fail); mixer.setVolume(60);
  master.setMuted(true); mixer.setVolume(40);
  assert.equal(target.muted, true); assert.equal(master.getMuted(), true);
  assert.deepEqual(mixer.snapshot(), { volume: 40, muted: false });
  master.setMuted(false); assert.equal(target.muted, false); assert.equal(target.volume, 32);
  mixer.toggleMuted(); master.setMuted(true); master.setMuted(false);
  assert.equal(target.muted, true); assert.equal(mixer.snapshot().muted, true);
  master.setVolume(0); mixer.setVolume(70);
  assert.equal(target.muted, true); assert.equal(target.volume, 0);
  master.setVolume(.5); assert.equal(target.volume, 35); assert.equal(target.muted, false);
  mixer.setVolume(0); master.setVolume(1);
  assert.equal(target.volume, 0); assert.equal(target.muted, true);
  mixer.disconnect();
});

test('new videos inherit master and disconnect releases the master subscription', () => {
  const master = new SoundManager([]); master.setVolume(.25); master.setMuted(true);
  const first = new VideoAudio(master), a = audioTarget(); first.connect(a, assert.fail);
  assert.equal(a.volume, 20); assert.equal(a.muted, true);
  first.setVolume(60); first.disconnect();
  const saved = { volume: a.volume, muted: a.muted };
  const next = new VideoAudio(master), b = audioTarget(); next.connect(b, assert.fail);
  master.setVolume(1); master.setMuted(false);
  assert.deepEqual({ volume: a.volume, muted: a.muted }, saved);
  assert.deepEqual(next.snapshot(), { volume: 80, muted: true });
  next.setVolume(100); assert.equal(b.volume, 100); assert.equal(b.muted, false);
  next.disconnect();
});

test('asynchronous mute acknowledgement does not undo a local change or bypass master mute', () => {
  const master = new SoundManager([]), mixer = new VideoAudio(master), target = audioTarget(true);
  mixer.connect(target, assert.fail);
  assert.equal(mixer.snapshot().muted, true); // stale provider value
  target.acknowledge(); mixer.snapshot();
  mixer.setVolume(55); assert.equal(mixer.snapshot().muted, false);
  target.acknowledge(); mixer.snapshot();
  target.muted = true; assert.equal(mixer.snapshot().muted, true); // native provider mute
  target.muted = false; assert.equal(mixer.snapshot().muted, false); // native provider unmute
  master.setMuted(true); target.acknowledge(); mixer.snapshot();
  target.muted = false; mixer.snapshot();
  assert.equal(target.requestedMute, true); assert.equal(mixer.snapshot().muted, false);
  target.acknowledge(); master.setMuted(false); target.acknowledge();
  assert.equal(mixer.snapshot().muted, false);
  mixer.disconnect();
});

const source = ts.transpileModule(await readFile(new URL('../src/os/win7/apps/youtube-api.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
let instance = 0;
async function setup() {
  const scripts = [], timers = new Map();
  const previousWindow = globalThis.window, previousDocument = globalThis.document;
  globalThis.window = {
    setTimeout(callback) { const id = timers.size + 1; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  globalThis.document = {
    createElement() { return { remove() { this.removed = true; } }; },
    head: { appendChild(script) { scripts.push(script); } },
  };
  const api = await import(`data:text/javascript;base64,${Buffer.from(`${source}\n// instance ${instance++}`).toString('base64')}`);
  return { ...api, scripts, timers, restore() {
    if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  } };
}

test('concurrent player requests share one official SDK and preserve an existing ready callback', async () => {
  const fixture = await setup();
  try {
    let previousCalls = 0;
    const previous = () => { previousCalls++; };
    window.onYouTubeIframeAPIReady = previous;
    const first = fixture.loadYouTubeAPI(), second = fixture.loadYouTubeAPI();
    assert.equal(first, second);
    assert.equal(fixture.scripts.length, 1);
    assert.equal(fixture.scripts[0].src, 'https://www.youtube.com/iframe_api');
    const api = { Player: class {} };
    window.YT = api;
    window.onYouTubeIframeAPIReady();
    assert.equal(await first, api);
    assert.equal(previousCalls, 1);
    assert.equal(window.onYouTubeIframeAPIReady, previous);
    assert.equal(fixture.timers.size, 0);
    assert.equal(await fixture.loadYouTubeAPI(), api);
    assert.equal(fixture.scripts.length, 1);
  } finally { fixture.restore(); }
});

test('SDK network failure and timeout release the failed script and allow retry', async () => {
  const fixture = await setup();
  try {
    const first = fixture.loadYouTubeAPI();
    const rejection = assert.rejects(first, /youtube-api-unavailable/);
    fixture.scripts[0].onerror(); await rejection;
    assert.equal(fixture.scripts[0].removed, true);
    assert.equal(fixture.timers.size, 0);
    const second = fixture.loadYouTubeAPI();
    const timeoutRejection = assert.rejects(second, /youtube-api-unavailable/);
    [...fixture.timers.values()][0](); await timeoutRejection;
    assert.equal(fixture.scripts.length, 2);
    assert.equal(fixture.scripts[1].removed, true);
    const third = fixture.loadYouTubeAPI();
    window.YT = { Player: class {} }; window.onYouTubeIframeAPIReady();
    assert.equal(await third, window.YT);
  } finally { fixture.restore(); }
});

test('time display tolerates missing metadata and long videos', async () => {
  const fixture = await setup();
  try {
    for (const value of [NaN, Infinity, -20]) assert.equal(fixture.playerTime(value), '00:00');
    assert.equal(fixture.playerTime(61.9), '01:01');
    assert.equal(fixture.playerTime(3661), '1:01:01');
  } finally { fixture.restore(); }
});
