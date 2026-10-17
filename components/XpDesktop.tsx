'use client';
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import XPApps, { type Program, type Selection } from './XPApps';
import XPIcon, { type IconName } from './XPIcon';
import XPImage from './XPImage';
import { LanguageProvider } from './LanguageContext';
import WallpaperSettings from './WallpaperSettings';
import { tr, type Language } from '@/lib/locale-dictionary';
import { DEFAULT_WALLPAPER, WALLPAPER_SETTING_KEY, getWallpaperImage, saveWallpaperImage, wallpaperURL, type WallpaperSetting } from '@/lib/wallpaper';
import type { ShowcaseItem } from '@/lib/showcase';
import type { Thumbnail } from '@/lib/thumbnails';

const shortcuts: {id:Program;label:string;icon:IconName}[] = [
 {id:'computer',label:'Meu computador',icon:'computer'},
 {id:'welcome',label:'Meu portfólio',icon:'portfolio'},
 {id:'work',label:'Meus trabalhos',icon:'folder'},
 {id:'about',label:'Sobre mim.txt',icon:'notepad'},
 {id:'skills',label:'Ferramentas',icon:'settings'},
 {id:'services',label:'Serviços',icon:'folder'},
 {id:'contact',label:'Contato',icon:'contact'},
 {id:'recycle',label:'Lixeira',icon:'recycle'}
];
const labels: Record<Program,{title:string;icon:IconName;w:number;h:number}> = {
 welcome:{title:'CAPIMASO.exe',icon:'portfolio',w:795,h:635}, computer:{title:'Meu computador',icon:'computer',w:800,h:575},
 work:{title:'Meus trabalhos',icon:'folder',w:1010,h:690},about:{title:'Sobre mim.txt — Bloco de notas',icon:'notepad',w:690,h:515},
 skills:{title:'Propriedades do sistema',icon:'settings',w:670,h:565},services:{title:'Serviços — CAPIMASO',icon:'folder',w:820,h:675},
 contact:{title:'Outlook Express',icon:'contact',w:825,h:555},recycle:{title:'Lixeira',icon:'recycle',w:490,h:360},
 player:{title:'Windows Media Player',icon:'player',w:835,h:690},viewer:{title:'Visualizador de imagens',icon:'image',w:900,h:690},
 properties:{title:'Propriedades de exibição',icon:'computer',w:570,h:630}
};
type WindowItem={id:Program;min:boolean;max:boolean;z:number;x:number;y:number;selection:Selection};
type Props={thumbnails:Thumbnail[];showcase:ShowcaseItem[]};
function isMobile(){return typeof window!=='undefined' && window.innerWidth<720;}

export default function XpDesktop({thumbnails,showcase}:Props) {
 const [windows,setWindows]=useState<WindowItem[]>([{id:'welcome',min:false,max:false,z:10,x:170,y:65,selection:{}}]);
 const [startOpen,setStartOpen]=useState(false);
 const [wallpaperMenu,setWallpaperMenu]=useState<{x:number;y:number}|null>(null);
 const [clock,setClock]=useState('');
 const [notice,setNotice]=useState<string|null>(null);
 const [selectedIcon,setSelectedIcon]=useState<Program|null>(null);
 const [compact,setCompact]=useState(false);
 const [language,setLanguage]=useState<Language>('en');
 const [wallpaper,setWallpaper]=useState<WallpaperSetting>(DEFAULT_WALLPAPER);
 const [customWallpaperUrl,setCustomWallpaperUrl]=useState('');
 const wallpaperUrlRef=useRef('');
 const [preferencesLoaded,setPreferencesLoaded]=useState(false);
 const messageTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const zSeed=useRef(10);
 useEffect(()=>{const update=()=>{setCompact(isMobile());setClock(new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}))};update();window.addEventListener('resize',update);const timer=setInterval(update,30000);return()=>{window.removeEventListener('resize',update);clearInterval(timer)}},[]);
 useEffect(()=>{try{const saved=localStorage.getItem('capimaso-xp-language');if(saved==='pt'||saved==='en')setLanguage(saved);const wp=localStorage.getItem(WALLPAPER_SETTING_KEY);if(wp){const parsed=JSON.parse(wp) as WallpaperSetting;if(['bliss','hills','repository','path','custom'].includes(parsed.kind))setWallpaper(parsed)}}catch{}setPreferencesLoaded(true);let active=true;getWallpaperImage().then(blob=>{if(!active||!blob)return;const url=URL.createObjectURL(blob);if(wallpaperUrlRef.current)URL.revokeObjectURL(wallpaperUrlRef.current);wallpaperUrlRef.current=url;setCustomWallpaperUrl(url)}).catch(()=>{});return()=>{active=false;if(wallpaperUrlRef.current)URL.revokeObjectURL(wallpaperUrlRef.current)}} ,[]);
 useEffect(()=>{if(!preferencesLoaded)return;localStorage.setItem('capimaso-xp-language',language);document.documentElement.lang=language==='en'?'en':'pt-BR'},[language,preferencesLoaded]);
 useEffect(()=>{if(!preferencesLoaded)return;localStorage.setItem(WALLPAPER_SETTING_KEY,JSON.stringify(wallpaper))},[wallpaper,preferencesLoaded]);
 const t=(text:string)=>tr(language,text);
 const setWallpaperImage=async(file:File)=>{await saveWallpaperImage(file);const url=URL.createObjectURL(file);if(wallpaperUrlRef.current)URL.revokeObjectURL(wallpaperUrlRef.current);wallpaperUrlRef.current=url;setCustomWallpaperUrl(url);setWallpaper({kind:'custom'})};
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setStartOpen(false);setWallpaperMenu(null);}};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[]);
 const notify=useCallback((s:string)=>{setNotice(s);if(messageTimer.current)clearTimeout(messageTimer.current);messageTimer.current=setTimeout(()=>setNotice(null),3300)},[]);
 const open=useCallback((id:Program,selection:Selection={})=>{setStartOpen(false);setWallpaperMenu(null);setWindows(items=>{const z=++zSeed.current;const found=items.find(x=>x.id===id);if(found)return items.map(x=>x.id===id?{...x,min:false,z,selection}:x);const n=items.length;return [...items,{id,min:false,max:false,z,x:140+(n%5)*29,y:52+(n%5)*25,selection}];})},[]);
 const close=(id:Program)=>setWindows(items=>items.filter(x=>x.id!==id));
 const focus=(id:Program)=>setWindows(items=>items.map(x=>x.id===id?{...x,z:++zSeed.current,min:false}:x));
 const minimize=(id:Program)=>setWindows(items=>items.map(x=>x.id===id?{...x,min:true}:x));
 const maximize=(id:Program)=>setWindows(items=>items.map(x=>x.id===id?{...x,max:!x.max,min:false,z:++zSeed.current}:x));
 const taskClick=(id:Program)=>{const win=windows.find(w=>w.id===id);if(!win)return;const onTop=win.z===Math.max(...windows.filter(x=>!x.min).map(x=>x.z),0);if(onTop&&!win.min)minimize(id);else focus(id)};
 const foreground=Math.max(...windows.filter(x=>!x.min).map(x=>x.z),0);
 return <LanguageProvider language={language}><main className="xp-desktop" style={{backgroundImage:`url("${wallpaperURL(wallpaper,customWallpaperUrl)}")`}} onClick={()=>{setStartOpen(false);setWallpaperMenu(null)}} onContextMenu={e=>{if((e.target as HTMLElement).closest('.xp-window, .xp-taskbar, .xp-start-menu'))return;e.preventDefault();setStartOpen(false);setWallpaperMenu({x:Math.min(e.clientX,innerWidth-220),y:Math.min(e.clientY,innerHeight-190)})}}>
 <div className="xp-desktop-icons" aria-label={t('Área de trabalho')}>{shortcuts.map(s=><button key={s.id} className={`xp-shortcut ${selectedIcon===s.id?'is-selected':''}`} onClick={e=>{e.stopPropagation();if(compact)open(s.id);else setSelectedIcon(s.id)}} onDoubleClick={e=>{e.stopPropagation();open(s.id)}} onKeyDown={e=>{if(e.key==='Enter'){open(s.id)}}}><XPIcon kind={s.icon} size={45}/><span>{t(s.label)}</span></button>)}</div>
 <div className="xp-desktop-windows">{windows.filter(w=>!w.min).map(w=><WindowChrome key={w.id} item={w} compact={compact} active={w.z===foreground} title={t(labels[w.id].title)} icon={labels[w.id].icon} onClose={()=>close(w.id)} onMinimize={()=>minimize(w.id)} onMaximize={()=>maximize(w.id)} onFocus={()=>focus(w.id)} onMove={(x,y)=>setWindows(a=>a.map(q=>q.id===w.id?{...q,x,y}:q))}>{w.id==='properties'?<WallpaperSettings wallpaper={wallpaper} customUrl={customWallpaperUrl} onChange={setWallpaper} onImage={setWallpaperImage} notify={notify}/>:<XPApps app={w.id} showcase={showcase} thumbnails={thumbnails} selection={w.selection} open={open} notify={notify}/>}</WindowChrome>)}</div>
 {wallpaperMenu&&<div className="xp-context" style={{left:wallpaperMenu.x,top:wallpaperMenu.y}} onClick={e=>e.stopPropagation()} role="menu"><button onClick={()=>setWallpaperMenu(null)}>{t('Organizar ícones por nome')}</button><button onClick={()=>window.location.reload()}>{t('Atualizar')}</button><hr/><button onClick={()=>open('properties')}>{t('Alterar plano de fundo')}</button><button onClick={()=>open('properties')}>{t('Propriedades')}</button></div>}
 {startOpen&&<StartMenu onOpen={open} onClose={()=>setStartOpen(false)} t={t}/>}
 <footer className="xp-taskbar" aria-label={t('Barra de tarefas')} onClick={e=>e.stopPropagation()}><button className={`xp-start-button ${startOpen?'active':''}`} onClick={()=>setStartOpen(x=>!x)} aria-expanded={startOpen}><XPIcon kind="start" size={27}/><b>{t('iniciar')}</b></button><div className="xp-quicklaunch"><button title={t('Meu computador')} onClick={()=>open('computer')}><XPIcon kind="computer" size={22}/></button><button title={t('Meus trabalhos')} onClick={()=>open('work')}><XPIcon kind="folder" size={22}/></button></div><div className="xp-task-items">{windows.map(w=><button key={w.id} className={`xp-task ${w.z===foreground&&!w.min?'current':''} ${w.min?'minimized':''}`} onClick={()=>taskClick(w.id)} title={t(labels[w.id].title)}><XPIcon kind={labels[w.id].icon} size={19}/><span>{t(labels[w.id].title)}</span></button>)}</div><div className="xp-language-switch" role="group" aria-label={t('Escolha um idioma')}><button className={language==='en'?'chosen':''} onClick={()=>setLanguage('en')} aria-pressed={language==='en'} title="English">EN</button><button className={language==='pt'?'chosen':''} onClick={()=>setLanguage('pt')} aria-pressed={language==='pt'} title="Português">PT</button></div><div className="xp-tray"><XPIcon kind="sound" size={17}/><span className="xp-tray-status" title={t('Disponível')}>●</span><time suppressHydrationWarning>{clock||'--:--'}</time></div></footer>
 {notice&&<div className="xp-balloon" role="status"><span>ℹ</span>{notice}<button onClick={()=>setNotice(null)} aria-label="Fechar aviso">×</button></div>}
 <div className="xp-mobile-hint">{t('Toque em um ícone para abrir · ou use iniciar')}</div>
 </main></LanguageProvider>;
}
function WindowChrome({item,compact,active,title,icon,onClose,onMinimize,onMaximize,onFocus,onMove,children}:{item:WindowItem;compact:boolean;active:boolean;title:string;icon:IconName;onClose:()=>void;onMinimize:()=>void;onMaximize:()=>void;onFocus:()=>void;onMove:(x:number,y:number)=>void;children:React.ReactNode}) {
 const drag=useRef<{id:number;sx:number;sy:number;x:number;y:number}|null>(null);
 const startDrag=(e:ReactPointerEvent<HTMLDivElement>)=>{onFocus();if(e.button!==0||compact||item.max||(e.target as HTMLElement).closest('button'))return;drag.current={id:e.pointerId,sx:e.clientX,sy:e.clientY,x:item.x,y:item.y};e.currentTarget.setPointerCapture(e.pointerId);};
 const dragging=(e:ReactPointerEvent<HTMLDivElement>)=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;const nx=Math.max(0,Math.min(innerWidth-120,d.x+e.clientX-d.sx));const ny=Math.max(0,Math.min(innerHeight-110,d.y+e.clientY-d.sy));onMove(nx,ny)};
 const stop=()=>{drag.current=null};
 const props={left:item.x,top:item.y,width:labels[item.id].w,height:labels[item.id].h,zIndex:item.z};
 return <section role="dialog" aria-label={title} aria-modal="false" className={`xp-window ${active?'xp-window-active':'xp-window-inactive'} ${item.max||compact?'xp-maximized':''}`} style={props} onPointerDown={onFocus}><div className="xp-titlebar" onPointerDown={startDrag} onPointerMove={dragging} onPointerUp={stop} onPointerCancel={stop} onDoubleClick={e=>{if(!(e.target as HTMLElement).closest('button'))onMaximize()}}><div className="xp-window-title"><XPIcon kind={icon} size={19}/><span>{title}</span></div><div className="xp-window-buttons" onPointerDown={e=>e.stopPropagation()}><button className="xp-min" aria-label="Minimizar" title="Minimizar" onClick={onMinimize}>_</button><button className="xp-max" aria-label={item.max?'Restaurar':'Maximizar'} title="Maximizar" onClick={onMaximize}>{item.max?'❐':'□'}</button><button className="xp-close" aria-label="Fechar" title="Fechar" onClick={onClose}>×</button></div></div><div className="xp-window-inner">{children}</div></section>;
}
function StartMenu({onOpen,onClose,t}:{onOpen:(id:Program)=>void;onClose:()=>void;t:(text:string)=>string}) {
 const left: {id:Program;label:string;icon:IconName;small:string}[]=[{id:'welcome',label:'CAPIMASO.exe',icon:'portfolio',small:'Meu portfólio'},{id:'work',label:'Meus trabalhos',icon:'video',small:'Explorador de arquivos'},{id:'about',label:'Bloco de notas',icon:'notepad',small:'Sobre mim'},{id:'contact',label:'Outlook Express',icon:'contact',small:'Fale comigo'}];
 const right:{id:Program;label:string;icon:IconName}[]=[{id:'computer',label:'Meu computador',icon:'computer'},{id:'skills',label:'Painel de controle',icon:'settings'},{id:'services',label:'Serviços',icon:'folder'},{id:'recycle',label:'Lixeira',icon:'recycle'}];
 return <div className="xp-start-menu" onClick={e=>e.stopPropagation()}><header><XPImage src="/images/profile.jpg" alt="CAPIMASO"/><b>CAPIMASO</b></header><div className="xp-start-columns"><div className="xp-start-left">{left.map(x=><button key={x.id} onClick={()=>onOpen(x.id)}><XPIcon kind={x.icon} size={36}/><span><b>{t(x.label)}</b><small>{t(x.small)}</small></span></button>)}<div className="xp-start-divider"/><button className="all-programs" onClick={()=>onOpen('computer')}><span>{t('Todos os programas')}</span><span>➜</span></button></div><div className="xp-start-right">{right.map(x=><button key={x.id} onClick={()=>onOpen(x.id)}><XPIcon kind={x.icon} size={25}/><b>{t(x.label)}</b></button>)}<div className="xp-start-divider"/><button onClick={()=>onOpen('contact')}><XPIcon kind="internet" size={24}/>{t('Conexões')}</button></div></div><footer><button onClick={()=>{onClose();onOpen('welcome')}}><span className="xp-logoff"><XPIcon kind="logoff" size={25}/></span> {t('Trocar usuário')}</button><button onClick={onClose}><span className="xp-off"><XPIcon kind="power" size={25}/></span> {t('Fechar menu')}</button></footer></div>;
}
