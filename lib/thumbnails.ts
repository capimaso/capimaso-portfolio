import fs from 'node:fs';
import path from 'node:path';
export type Thumbnail = { name: string; src: string };
/** Todas as imagens em public/images/thumbs aparecem automaticamente no explorador. */
export function getThumbnails(): Thumbnail[] {
  const dir = path.join(process.cwd(), 'public/images/thumbs');
  try { const names = fs.readdirSync(dir).filter(x=>!x.startsWith('.') && /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(x));
    if(!names.length)return [{name:'ThumbBizu.png',src:'/images/thumbs/ThumbBizu.png'}];
    return names
    .sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}))
    .map(name=>({name,src:`/images/thumbs/${encodeURIComponent(name)}`})); }
  catch { return [{name:'ThumbBizu.png',src:'/images/thumbs/ThumbBizu.png'}]; }
}
