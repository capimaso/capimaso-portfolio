/**
 * Preserves the existing repo assets when this ZIP is used as a standalone project.
 * If uploaded over the ORIGINAL repository, originals already exist and are NEVER replaced.
 * Usage: npm run assets:sync
 * Public source: https://github.com/capimaso/capimaso-portfolio (main)
 * No token, API key or private content required.
 */
import { mkdir, access, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
const root=process.cwd();
// Pinned to the inspected original commit, so restoring assets still works after replacing main.
const ORIGINAL_REF='8959ea5a72142ac25a9a443394501c5053424e2e';
const files=[
 'icons/cursor-drag.svg','icons/cursor-pointer.svg','icons/cursor-text.svg','icons/cursor.svg',
 'images/avatars/megluuh.jpg','images/final-placeholder.svg','images/profile.jpg',
 'images/project-creator.svg','images/project-gaming.svg','images/project-long.svg',
 'images/project-motion.svg','images/project-short.svg','images/raw-placeholder.svg',
 'images/scarfaceThumb.png','images/thumbs/ThumbBizu.png','images/wallpaper.svg'

];
// Keep originals of the old site metadata graphics alongside the new branding.
const targets = files.map(rel=>({source:rel,target:rel}));
targets.push({source:'images/og.svg',target:'legacy/images/og.svg'});
targets.push({source:'icons/favicon.svg',target:'legacy/icons/favicon.svg'});
let synced=0,missing=0;
const queue=[...targets];
async function worker(){while(queue.length){const job=queue.shift();if(!job)break;const rel=job.source;const path=join(root,'public',job.target);try{await access(path);continue}catch{}
 try{const endpoint=`https://raw.githubusercontent.com/capimaso/capimaso-portfolio/${ORIGINAL_REF}/public/${rel.split('/').map(encodeURIComponent).join('/')}`;
  const result=await fetch(endpoint,{signal:AbortSignal.timeout(10000)});
  if(!result.ok)throw Error(`HTTP ${result.status}`);
  const bytes=Buffer.from(await result.arrayBuffer());
  await mkdir(dirname(path),{recursive:true});
  await writeFile(path,bytes,{flag:'wx'});
  synced++;
 }catch(e){missing++;console.warn(`  • original não recuperado: ${rel} (${String(e.message||e)})`)}
}}
await Promise.all(Array.from({length:5},worker));
if(synced)console.log(`✓ ${synced} arquivos originais restaurados sem alterar arquivos existentes.`);
if(missing)console.warn(`ℹ ${missing} arquivo(s) originais precisam de acesso à internet para sincronizar.\n  O site pode usar URLs de backup; execute npm run assets:sync quando estiver online.`);
