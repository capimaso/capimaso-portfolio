/** Offline sanity checks for contributors and Codex. No npm dependencies required. */
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
const root=process.cwd();let errors=0;
function assert(value,message){if(!value){console.error(`✖ ${message}`);errors++}else console.log(`✓ ${message}`)}
const work=JSON.parse(await readFile(join(root,'data/showcase.json'),'utf8'));
assert(Array.isArray(work)&&work.length>0,'Manifesto de projetos não vazio');
assert(new Set(work.map(x=>x.id)).size===work.length,'IDs de vídeos únicos');
assert(work.every(x=>x.id&&x.title&&['short','long'].includes(x.format)),'Projetos com informações obrigatórias');
assert(work.filter(x=>x.format==='long').every(x=>/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(x.video)),'Vídeos longos usam YouTube');
assert(work.filter(x=>x.format==='short').every(x=>x.video.startsWith('/videos/')||/^https:\/\/www\.instagram\.com\/reel\//.test(x.video)), 'Reels locais ou link Instagram legado explicitamente preservado');
assert(work.every(x=>!x.thumbnail||x.thumbnail.startsWith('/images/')),'Capas usam caminhos locais');
for(const p of ['app/xp.css','app/page.tsx','app/studio/page.tsx','components/XpDesktop.tsx','components/XPApps.tsx','public/images/xp-hills.svg','AGENTS.md','README.md','MUDANCAS.md','postcss.config.mjs','lib/locale-dictionary.ts','lib/wallpaper.ts','components/LanguageContext.tsx','components/WallpaperSettings.tsx']){
 try{await access(join(root,p));console.log(`✓ ${p}`)}catch{console.error(`✖ faltando ${p}`);errors++}
}
const desktop=await readFile(join(root,'components/XpDesktop.tsx'),'utf8');
const apps=await readFile(join(root,'components/XPApps.tsx'),'utf8');
const css=await readFile(join(root,'app/xp.css'),'utf8');
const icons=await readFile(join(root,'components/XPIcon.tsx'),'utf8');
const context=await readFile(join(root,'components/LanguageContext.tsx'),'utf8');
assert(context.includes("@/lib/locale-dictionary")&&desktop.includes("@/lib/locale-dictionary"),'Traduções importadas sem conflito com i18n.tsx legado');
assert(desktop.includes('xp-language-switch')&&desktop.includes("useState<Language>('en')"),'Alternador EN/PT e inglês inicial');
assert(desktop.includes('WallpaperSettings')&&css.includes('.wallpaper-settings'),'Papel de parede configurável');
assert(apps.includes('autoplay=1&mute=1')&&apps.includes('controls autoPlay muted'),'Autoplay mudo YouTube e MP4/WebM');
assert(css.includes('container-type:size')&&css.includes('177.777cqh'),'Player com proporção responsiva');
assert(icons.includes("kind==='logoff'")&&icons.includes("kind==='power'"),'Ícones SVG do menu Iniciar');
assert(css.includes('/icons/cursor.svg')&&css.includes('/icons/cursor-pointer.svg'),'Cursores do portfólio original');
if(errors)process.exitCode=1;else console.log(`\nCAPIMASO XP: ${work.length} projetos, verificações básicas concluídas. `);
