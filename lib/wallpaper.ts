export type WallpaperSetting = { kind: 'bliss' | 'hills' | 'repository' | 'path' | 'custom'; path?: string };
export const DEFAULT_WALLPAPER: WallpaperSetting = { kind:'bliss' };
export const DEFAULT_PUBLIC_WALLPAPER = '/images/xp-bliss.jpg';
export const WALLPAPER_SETTING_KEY = 'capimaso-xp-wallpaper-v2';
const DB_NAME = 'capimaso-xp-preferences';
const STORE_NAME = 'wallpaper';
function database(): Promise<IDBDatabase> {
 return new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB_NAME,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE_NAME))req.result.createObjectStore(STORE_NAME)};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
 });
}
export async function saveWallpaperImage(blob:Blob):Promise<void>{
 const db=await database();try{await new Promise<void>((resolve,reject)=>{
  const tx=db.transaction(STORE_NAME,'readwrite');tx.objectStore(STORE_NAME).put(blob,'desktop');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);
 });}finally{db.close()}
}
export async function getWallpaperImage():Promise<Blob|null>{
 const db=await database();try{return await new Promise<Blob|null>((resolve,reject)=>{
  const tx=db.transaction(STORE_NAME,'readonly');const req=tx.objectStore(STORE_NAME).get('desktop');req.onsuccess=()=>resolve(req.result??null);req.onerror=()=>reject(req.error);
 });}finally{db.close()}
}
export function wallpaperURL(setting:WallpaperSetting,customUrl:string):string {
 if(setting.kind==='bliss')return '/images/xp-bliss.jpg';
 if(setting.kind==='hills')return '/images/xp-hills.svg';
 if(setting.kind==='repository')return '/images/wallpaper.svg';
 if(setting.kind==='path')return setting.path?.startsWith('/images/') ? setting.path : DEFAULT_PUBLIC_WALLPAPER;
 if(setting.kind==='custom')return customUrl || DEFAULT_PUBLIC_WALLPAPER;
 return DEFAULT_PUBLIC_WALLPAPER;
}
