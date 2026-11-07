import { readFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';

const moduleURL = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const compile = async path => ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
}).outputText;
const profileURL = moduleURL(await compile('../data/profile.ts'));
const siteURL = moduleURL((await compile('../data/site.ts')).replace("'./profile'", JSON.stringify(profileURL)));
const localeURL = moduleURL(await compile('../lib/locale-dictionary.ts'));
const metadataURL = moduleURL((await compile('../lib/site-metadata.ts'))
  .replace("'@/data/profile'", JSON.stringify(profileURL))
  .replace("'@/data/site'", JSON.stringify(siteURL))
  .replace("'./locale-dictionary'", JSON.stringify(localeURL)));
const { getSiteURL, homeMetadata } = await import(metadataURL);
const { default: robots } = await import(moduleURL((await compile('../app/robots.ts'))
  .replace("'@/lib/site-metadata'", JSON.stringify(metadataURL))));
const { default: sitemap } = await import(moduleURL((await compile('../app/sitemap.ts'))
  .replace("'@/lib/site-metadata'", JSON.stringify(metadataURL))));

test('public origin is optional, normalizes URLs and rejects unsuitable configuration', () => {
  for (const value of ['', '  ']) assert.equal(getSiteURL(value), undefined);
  assert.equal(getSiteURL(' https://portfolio.example ').href, 'https://portfolio.example/');
  assert.equal(getSiteURL('http://localhost:3000/').href, 'http://localhost:3000/');
  for (const value of ['portfolio.example', '/portfolio', 'ftp://portfolio.example', 'javascript:alert(1)',
    'https://user:password@portfolio.example', 'https://portfolio.example/project',
    'https://portfolio.example/?token=test', 'https://portfolio.example/#profile']) {
    assert.throws(() => getSiteURL(value), /SITE_URL must be an absolute HTTP\(S\) origin/);
  }
});

test('unconfigured metadata never publishes a guessed origin or localhost sharing URLs', () => {
  const metadata = homeMetadata();
  assert.equal(metadata.metadataBase, undefined);
  assert.equal(metadata.alternates, undefined);
  assert.equal(metadata.openGraph.url, undefined);
  assert.equal(metadata.openGraph.images, undefined);
  assert.equal(metadata.twitter.images, undefined);
  assert.equal(metadata.twitter.card, 'summary');
  assert.doesNotMatch(JSON.stringify(metadata), /https?:\/\//);
  assert.equal(metadata.title, metadata.openGraph.title);
  assert.equal(metadata.description, metadata.twitter.description);
});

test('configured metadata shares one canonical origin and an existing original image', async () => {
  const metadata = homeMetadata(getSiteURL('https://portfolio.example'));
  assert.equal(metadata.alternates.canonical, 'https://portfolio.example/');
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.equal(metadata.metadataBase.href, metadata.alternates.canonical);
  assert.equal(metadata.title, metadata.openGraph.title);
  assert.equal(metadata.title, metadata.twitter.title);
  assert.match(metadata.description, /Tiago \/ CAPIMASO.*Photography/);
  assert.equal(metadata.description, metadata.openGraph.description);
  assert.equal(metadata.description, metadata.twitter.description);
  assert.equal(metadata.openGraph.locale, 'en_US');
  assert.deepEqual(metadata.openGraph.alternateLocale, ['pt_BR']);
  const image = metadata.openGraph.images[0];
  assert.equal(image.url, 'https://portfolio.example/assets/win7/wallpapers/desktop-logo.jpg');
  assert.deepEqual(metadata.twitter.images[0], image);
  assert.equal(metadata.twitter.card, 'summary_large_image');
  await access(new URL(`../public${new URL(image.url).pathname}`, import.meta.url));
});

test('robots and sitemap include only the canonical public home and omit guessed URLs', () => {
  const saved = process.env.SITE_URL;
  try {
    delete process.env.SITE_URL;
    assert.deepEqual(sitemap(), []);
    assert.equal(robots().sitemap, undefined);
    process.env.SITE_URL = 'https://portfolio.example';
    assert.deepEqual(sitemap(), [{ url: 'https://portfolio.example/' }]);
    assert.equal(robots().sitemap, 'https://portfolio.example/sitemap.xml');
    assert.deepEqual(robots().rules, { userAgent: '*', allow: '/', disallow: ['/api/', '/studio'] });
    assert.doesNotMatch(JSON.stringify(sitemap()), /studio|api|\/xp|win7|localhost/);
  } finally {
    if (saved === undefined) delete process.env.SITE_URL; else process.env.SITE_URL = saved;
  }
});
