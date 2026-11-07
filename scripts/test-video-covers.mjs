import { readFile } from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';

const source = ts.transpileModule(await readFile(new URL('../src/server/video-covers.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText.replace("import 'server-only';", '');
const { withVideoCovers } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const entries = JSON.parse(await readFile(new URL('../data/showcase.json', import.meta.url), 'utf8'));

test('dropping a matching cover replaces only that poster, even after renaming the title', () => {
  const originals = structuredClone(entries);
  const renamed = entries.map(item => item.id === 'corte-pib-1' ? { ...item, title: 'Título escolhido pelo proprietário' } : item);
  const result = withVideoCovers(renamed, ['corte-pib-1.webp', 'megluuh.PNG']);
  assert.equal(result.find(item => item.id === 'corte-pib-1').thumbnail, '/images/posters/custom/corte-pib-1.webp');
  assert.equal(result.find(item => item.id === 'corte-pib-1').title, 'Título escolhido pelo proprietário');
  assert.equal(result.find(item => item.id === 'megluuh').thumbnail, '/images/posters/custom/megluuh.PNG');
  for (const item of result) {
    assert.equal(item.video, originals.find(original => original.id === item.id).video);
    if (!['corte-pib-1', 'megluuh'].includes(item.id)) assert.deepEqual(item, originals.find(original => original.id === item.id));
  }
  assert.deepEqual(entries, originals);
});

test('missing, unknown and unsuitable cover names preserve existing assets; conflicts use documented priority', () => {
  assert.deepEqual(withVideoCovers(entries, []), entries);
  assert.deepEqual(withVideoCovers(entries, ['LEIA-ME.md', 'outro-video.jpg', '../corte-pib-1.jpg', 'corte-pib-1.svg', 'corte-pib-1.mp4']), entries);
  const result = withVideoCovers(entries, ['corte-pib-1.webp', 'corte-pib-1.jpg', 'corte-pib-1.png']);
  assert.equal(result.find(item => item.id === 'corte-pib-1').thumbnail, '/images/posters/custom/corte-pib-1.png');
});
