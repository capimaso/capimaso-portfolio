import { NextResponse } from 'next/server';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import type { ShowcaseItem } from '@/lib/showcase';
import { googleDriveEmbed } from '@/lib/google-drive.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const ROOT = process.cwd();
const POSTER_DIR = join(ROOT,'public','images','thumbs');
const DATA_FILE = join(ROOT,'data','showcase.json');
const MAX_POSTER=8*1024*1024;
const response=(error:string,code=400)=>NextResponse.json({error},{status:code});
function slugify(text:string){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,65)||'short'}
function checkFile(v:FormDataEntryValue|null,types:string[],max:number):v is File{return v instanceof File&&v.size>0&&v.size<=max&&types.includes(v.type)}
/** Browser upload is deliberately unavailable in production; git is the publication gate. */
export async function POST(request:Request){
 if(process.env.NODE_ENV!=='development')return response('Upload disponível apenas em npm run dev, no seu computador.',403);
 // Avoid opportunistic cross-site writes to a developer's local server.
 const origin=request.headers.get('origin');
 if(origin){try {const u=new URL(origin);if(!['localhost','127.0.0.1'].includes(u.hostname))return response('Acesso permitido apenas via localhost.',403);}catch{return response('Origem inválida.',403)}}
 try{
  const form=await request.formData();
  const title=String(form.get('title')||'').trim().slice(0,130);
  const description=String(form.get('description')||'').trim().slice(0,500);
  const category=String(form.get('category')||'Gaming • Short form').trim().slice(0,90);
  const video=String(form.get('video')||'').trim();const cover=form.get('cover');
  if(!title)return response('Informe o título do vídeo.');
  if(!googleDriveEmbed(video))return response('Informe um link de arquivo válido do Google Drive.');
  if(!checkFile(cover,['image/jpeg','image/png','image/webp'],MAX_POSTER))return response('Envie uma capa JPG/PNG/WebP (até 8 MB).');
  const picture=Buffer.from(await cover.arrayBuffer());
  // Check basic file signatures; do not rely on extension alone.
  const isJpg=cover.type==='image/jpeg'&&picture.subarray(0,3).toString('hex')==='ffd8ff';
  const isPng=cover.type==='image/png'&&picture.subarray(0,8).toString('hex')==='89504e470d0a1a0a';
  const isWebp=cover.type==='image/webp'&&picture.subarray(0,4).toString('ascii')==='RIFF'&&picture.subarray(8,12).toString('ascii')==='WEBP';
  if(!(isJpg||isPng||isWebp))return response('O conteúdo da capa não corresponde ao formato declarado.');
  const id=`${slugify(title)}-${randomUUID().slice(0,7)}`;
  const coverName=`${id}.${isJpg?'jpg':isPng?'png':'webp'}`;
  await mkdir(POSTER_DIR,{recursive:true});
  const coverPath=join(POSTER_DIR,coverName);
  await writeFile(coverPath,picture,{flag:'wx'});
  const previous: ShowcaseItem[]=JSON.parse(await readFile(DATA_FILE,'utf8'));
  const entry: ShowcaseItem={id,title,description,category,format:'short',video,thumbnail:`/images/thumbs/${coverName}`,software:'Premiere Pro'};
  const tmp=`${DATA_FILE}.${randomUUID()}.tmp`;
  await writeFile(tmp,JSON.stringify([entry,...previous],null,2)+'\n');
  await rename(tmp,DATA_FILE);
  return NextResponse.json({ok:true,entry}, {status:201});
 }catch(e){console.error('studio upload',e);return response('Falha ao salvar. Verifique as permissões do projeto.',500)}
}
