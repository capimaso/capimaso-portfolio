'use client';
import { useRef, useState } from 'react';
import { useT } from './LanguageContext';
import { DEFAULT_WALLPAPER, type WallpaperSetting, wallpaperURL } from '@/lib/wallpaper';
import XPIcon from './XPIcon';

type Props = {
 wallpaper: WallpaperSetting;
 customUrl: string;
 onChange: (next: WallpaperSetting) => void;
 onImage: (file: File) => Promise<void>;
 notify: (text: string) => void;
};

export default function WallpaperSettings({ wallpaper, customUrl, onChange, onImage, notify }: Props) {
 const t = useT();
 const fileRef = useRef<HTMLInputElement>(null);
 const [working, setWorking] = useState(false);
 const options: { setting: WallpaperSetting; label: string; disabled?: boolean }[] = [
  { setting: {kind:'bliss'}, label: 'Windows XP Bliss (padrão)' },
  { setting: {kind:'hills'}, label: 'Colinas XP (ilustração)' },
  { setting: {kind:'repository'}, label: 'Fundo do repositório' },
  { setting: {kind:'custom'}, label: 'Imagem enviada', disabled: !customUrl },
 ];
 const selected = (kind:WallpaperSetting['kind']) => kind === wallpaper.kind ||
  (kind === 'bliss' && wallpaper.kind === 'path' && wallpaper.path === '/images/xp-bliss.jpg');
 async function handleImage(file?: File) {
  if (!file) return;
  if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type)) {
   notify(t('Escolha uma imagem JPG, PNG, WebP ou GIF.'));
   return;
  }
  setWorking(true);
  try { await onImage(file); notify(t('Fundo atualizado!')); }
  catch { notify(t('O navegador não conseguiu salvar esta imagem. Tente um arquivo menor.')); }
  finally { setWorking(false); }
 }
 return <div className="wallpaper-settings settings-page">
  <div className="xp-tabs"><span className="chosen">{t('Papel de parede')}</span></div>
  <div className="settings-panel wallpaper-settings-panel">
   <div className="wallpaper-heading"><XPIcon kind="computer" size={38}/><div>
    <h2>{t('Personalizar a área de trabalho')}</h2>
    <p>{t('Escolha uma imagem no seu computador ou use uma opção já disponível.')}</p>
   </div></div>
   <div className="wallpaper-preview" style={{backgroundImage:`url("${wallpaperURL(wallpaper,customUrl)}")`}}>
    <span>CAPIMASO.exe</span><div className="wallpaper-preview-taskbar"><span>start</span></div>
   </div>
   <div className="wallpaper-options" role="group" aria-label={t('Papel de parede')}>
    {options.map(({setting,label,disabled}) => <button key={setting.kind}
     disabled={disabled} className={`wallpaper-choice ${selected(setting.kind)?'chosen':''}`}
     onClick={() => onChange(setting)}><span className="wallpaper-radio"/>{t(label)}</button>)}
   </div>
   <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
    className="wallpaper-file-input" onChange={e=>{void handleImage(e.currentTarget.files?.[0]);e.currentTarget.value=''}} />
   <div className="wallpaper-actions">
    <button className="xp-button xp-button-primary" disabled={working} onClick={()=>fileRef.current?.click()}>
     <XPIcon kind="image" size={20}/>{working?'…':t('Procurar arquivo…')}
    </button>
    <button className="xp-button" onClick={()=>onChange(DEFAULT_WALLPAPER)}>{t('Restaurar padrão')}</button>
   </div>
   <p className="wallpaper-help">{t('O papel de parede Bliss deve estar em public/images/xp-bliss.jpg. Imagens enviadas pelo botão ficam salvas somente neste navegador.')}</p>
  </div>
 </div>;
}
