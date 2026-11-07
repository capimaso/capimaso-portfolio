/** Offline sanity checks for contributors and Codex. No npm dependencies required. */
import { readFile, access, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { googleDriveEmbed } from '../lib/google-drive.mjs';
const root=process.cwd();let errors=0;
function assert(value,message){if(!value){console.error(`✖ ${message}`);errors++}else console.log(`✓ ${message}`)}
const work=JSON.parse(await readFile(join(root,'data/showcase.json'),'utf8'));
assert(Array.isArray(work)&&work.length>0,'Manifesto de projetos não vazio');
assert(new Set(work.map(x=>x.id)).size===work.length,'IDs de vídeos únicos');
assert(work.every(x=>x.id&&x.title&&['short','long'].includes(x.format)),'Projetos com informações obrigatórias');
assert(work.filter(x=>x.format==='long').every(x=>/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(x.video)),'Vídeos longos usam YouTube');
assert(work.filter(x=>x.format==='short').every(x=>x.video===''||googleDriveEmbed(x.video)||/^https:\/\/www\.instagram\.com\/reel\//.test(x.video)), 'Curtos usam Google Drive, estão pendentes ou preservam Instagram legado');
const drivePreview='https://drive.google.com/file/d/test_ID-123/preview';
for(const link of [
 'https://drive.google.com/file/d/test_ID-123/view?usp=sharing',
 drivePreview,
 'https://drive.google.com/file/d/test_ID-123',
 'https://drive.google.com/open?id=test_ID-123',
 'https://drive.google.com/uc?export=download&id=test_ID-123'
]) assert(googleDriveEmbed(link)===drivePreview,`Link Drive aceito: ${link}`);
assert(googleDriveEmbed('https://drive.google.com/file/d/test_ID-123/view?resourcekey=key-123&usp=sharing')===`${drivePreview}?resourcekey=key-123`,'Drive preserva resourcekey');
assert(['','not a url','/videos/shorts/video.mp4','http://drive.google.com/file/d/test/view',
 'https://drive.google.com.evil.test/file/d/test/view','https://drive.google.com@evil.test/file/d/test/view',
 'https://drive.google.com/drive/folders/test','https://drive.google.com/open?id=test%2Fother',
 'https://drive.google.com/file/d/test/view/extra','https://youtube.com/watch?v=test'
].every(link=>googleDriveEmbed(link)===null),'Drive rejeita arquivos locais, hosts falsos, pastas e links inválidos');
assert(work.every(x=>!x.thumbnail||x.thumbnail.startsWith('/images/')),'Capas usam caminhos locais');
for(const item of work.filter(x=>x.thumbnail)){
 try{await access(join(root,'public',item.thumbnail));console.log(`✓ Capa preservada: ${item.id}`)}catch{assert(false,`Capa ausente: ${item.id}`)}
}
for(const p of ['app/page.tsx','app/studio/page.tsx','app/studio/layout.tsx','src/os/win7/Win7Desktop.tsx','src/os/win7/apps/Profile.tsx','src/os/win7/apps/WmpPlayer.tsx','src/os/win7/apps/MediaExplorer.tsx','src/os/win7/studio/Studio.tsx','src/os/win7/studio/studio.module.css','AGENTS.md','README.md','MUDANCAS.md','postcss.config.mjs','lib/locale-dictionary.ts','src/shared/LanguageContext.tsx']){
 try{await access(join(root,p));console.log(`✓ ${p}`)}catch{console.error(`✖ faltando ${p}`);errors++}
}
// Verify the actual shell asset map, including filenames with spaces.
const assetMap = await readFile(join(root, 'src/os/win7/assets.ts'), 'utf8');
const win7Styles = await readFile(join(root, 'src/os/win7/win7.module.css'), 'utf8');
const shellAssets = new Set([
 ...Array.from(assetMap.matchAll(/icon\('([^']+)', '([^']+)'\)/g), match => `assets/win7/icons/${match[1]}/${match[2]}.ico`),
 ...Array.from(win7Styles.matchAll(/url\('([^']+)'\)/g), match => decodeURIComponent(match[1]).replace(/^\//, '')),
]);
for (const asset of shellAssets) {
 try { await access(join(root, 'public', asset)); assert(true, `Win7 asset: ${asset}`); }
 catch { assert(false, `Win7 asset missing: ${asset}`); }
}
const orb = await readFile(join(root, 'public/assets/win7/theme/start-orb.png'));
assert(orb.readUInt32BE(16) === 106 && orb.readUInt32BE(20) === 318, 'Start Orb: three original 106px frames');
const home=await readFile(join(root,'app/page.tsx'),'utf8');
const desktop=await readFile(join(root,'src/os/win7/Win7Desktop.tsx'),'utf8');
const player=await readFile(join(root,'src/os/win7/apps/WmpPlayer.tsx'),'utf8');
const playerStyles=await readFile(join(root,'src/os/win7/apps/wmp.module.css'),'utf8');
const youtube=await readFile(join(root,'src/os/win7/apps/useYouTubePlayer.ts'),'utf8');
const studioPage=await readFile(join(root,'app/studio/page.tsx'),'utf8');
const upload=await readFile(join(root,'app/api/studio/upload/route.ts'),'utf8');
const context=await readFile(join(root,'src/shared/LanguageContext.tsx'),'utf8');
assert(home.includes('<Win7Desktop')&&!home.includes('BootScreen'),'Win7 é a entrada principal');
assert(context.includes("@/lib/locale-dictionary")&&desktop.includes("useState<Language>('en')"),'Dicionário compartilhado e inglês inicial');
assert(desktop.includes('capimaso-xp-language'),'Preferência de idioma existente preservada');
assert(youtube.includes('player.mute()')&&youtube.includes('player.playVideo()'),'YouTube inicia mudo');
assert(player.includes('googleDriveEmbed')&&!player.includes('drive}&autoplay'),'Drive mantém o preview sem autoplay forçado');
assert(playerStyles.includes('container-type: size')&&playerStyles.includes('16 / 9')&&playerStyles.includes('9 / 16'),'Player com proporções responsivas');
assert(studioPage.includes("process.env.NODE_ENV !== 'development'")&&studioPage.includes('notFound()'),'Estúdio restrito ao desenvolvimento');
assert(upload.includes("process.env.NODE_ENV!=='development'")&&upload.includes("'posters'"),'API local preservada e capas separadas da galeria de thumbnails');
async function sourceFiles(directory) {
 const files=[];
 for(const entry of await readdir(directory,{withFileTypes:true})) {
  const file=join(directory,entry.name);
  if(entry.isDirectory())files.push(...await sourceFiles(file));
  else if(/\.(tsx?|css)$/.test(entry.name))files.push(file);
 }
 return files;
}
const activeLegacyDependencies=[];
for(const file of [...await sourceFiles(join(root,'app')),...await sourceFiles(join(root,'src/os/win7'))]) {
 const source=await readFile(file,'utf8');
 if(/(?:from\s*|import\s*)['"][^'"]*(?:src\/os\/xp|src\/boot)/.test(source)||source.includes('href="/xp"')||source.includes('xp-shell'))activeLegacyDependencies.push(file.slice(root.length+1));
}
assert(activeLegacyDependencies.length===0,`Entradas e Win7 sem dependências XP/boot${activeLegacyDependencies.length ? ': '+activeLegacyDependencies.join(', ') : ''}`);
if(errors)process.exitCode=1;else console.log(`\nCAPIMASO Win7: ${work.length} projetos, verificações básicas concluídas. `);
