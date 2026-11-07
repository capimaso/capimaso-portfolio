'use client';
import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import Link from 'next/link';
import Win7Icon from '../Win7Icon';
import type { Language } from '@/lib/locale-dictionary';
import { LanguageProvider, useT } from '@/src/shared/LanguageContext';
import { googleDriveEmbed } from '@/lib/google-drive.mjs';
import styles from './studio.module.css';

type State = 'idle' | 'sending' | 'success' | 'error';
export default function Studio() {
 const [language, setLanguage] = useState<Language>('en');
 useEffect(() => {
  try { const saved = localStorage.getItem('capimaso-xp-language'); if (saved === 'pt' || saved === 'en') setLanguage(saved); } catch {}
 }, []);
 useEffect(() => { document.documentElement.lang = language === 'en' ? 'en' : 'pt-BR'; }, [language]);
 const changeLanguage = (next: Language) => {
  setLanguage(next);
  try { localStorage.setItem('capimaso-xp-language', next); } catch {}
 };
 return <LanguageProvider language={language}><StudioForm language={language} onLanguage={changeLanguage} /></LanguageProvider>;
}

function StudioForm({ language, onLanguage }: { language: Language; onLanguage: (language: Language) => void }) {
 const t = useT();
 const [title, setTitle] = useState('');
 const [description, setDescription] = useState('');
 const [category, setCategory] = useState('Gaming • Short form');
 const [video, setVideo] = useState('');
 const [cover, setCover] = useState<File | null>(null);
 const [coverUrl, setCoverUrl] = useState('');
 const [status, setStatus] = useState<State>('idle');
 const [message, setMessage] = useState('');
 const preview = googleDriveEmbed(video.trim());
 useEffect(() => {
  if (!cover) { setCoverUrl(''); return; }
  const url = URL.createObjectURL(cover);
  setCoverUrl(url);
  return () => URL.revokeObjectURL(url);
 }, [cover]);
 const pickCover = (e: ChangeEvent<HTMLInputElement>) => setCover(e.target.files?.[0] || null);
 async function submit(e: FormEvent) {
  e.preventDefault();
  if (status === 'sending') return;
  if (!preview || !cover) {
   setStatus('error'); setMessage(t('Informe um link válido do Google Drive e selecione uma capa.')); return;
  }
  setStatus('sending'); setMessage(t('Salvando os arquivos no projeto...'));
  const form = new FormData();
  form.append('title', title); form.append('description', description); form.append('category', category);
  form.append('video', video.trim()); form.append('cover', cover);
  try {
   const result = await fetch('/api/studio/upload', { method: 'POST', body: form });
   const payload = await result.json();
   if (!result.ok) throw Error(payload.error || t('Erro ao salvar.'));
   setStatus('success'); setMessage(t('Publicado no projeto local! Agora faça git add, commit e push para publicar no site.'));
  } catch (e) {
   setStatus('error'); setMessage(e instanceof Error ? e.message : t('Erro inesperado.'));
  }
 }
 return <main className={styles.page} data-win7-studio><div className={`window glass active ${styles.window}`}>
  <div className={`title-bar ${styles.titlebar}`}><div className={`title-bar-text ${styles.title}`}><Win7Icon name="videos" size={20}/> {t('Estúdio CAPIMASO — importar mídia')}</div><Link className={styles.close} href="/" aria-label={t('Fechar')}>×</Link></div>
  <div className={styles.languages} role="group" aria-label="Language / Idioma"><button type="button" aria-pressed={language === 'en'} onClick={() => onLanguage('en')}>EN</button><button type="button" aria-pressed={language === 'pt'} onClick={() => onLanguage('pt')}>PT</button></div>
  <div className={`window-body ${styles.content}`}>
   <header className={styles.heading}><img src="/images/profile.jpg" alt="CAPIMASO" width={64} height={64}/><div><p>{t('CAPIMASO / GERENCIADOR LOCAL')}</p><h1>{t('Adicionar Reel / Short')}</h1><span>{t('Cole o link do Google Drive e escolha a capa que aparecerá no portfólio.')}</span></div></header>
   <div className={styles.callout}><strong>{t('Importante:')}</strong> {t('Este estúdio funciona apenas enquanto você roda')} <code>npm run dev</code> {t('no seu computador. Apenas a capa e o link são salvos no projeto; o vídeo fica no Google Drive.')}</div>
   <form onSubmit={submit} className={styles.form}>
    <fieldset className={styles.fields} disabled={status === 'sending'} aria-label={t('Adicionar Reel / Short')}>
    <label>{t('Título do vídeo')}<input value={title} onChange={e => setTitle(e.target.value)} required maxLength={130} placeholder={t('Ex.: Edit gameplay — meus melhores cortes')}/></label>
    <label>{t('Breve descrição')}<textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={500} rows={3} placeholder={t('Contexto, cliente ou estilo...')}/></label>
    <label>{t('Categoria')}<input value={category} onChange={e => setCategory(e.target.value)} maxLength={90}/></label>
    <div className={styles.fileRow}>
     <label>{'1. ' + t('Link do Google Drive')}<small>{t('Compartilhe como “Qualquer pessoa com o link” (Leitor).')}</small><input type="url" value={video} onChange={e => { setVideo(e.target.value); setStatus('idle'); setMessage(''); }} placeholder="https://drive.google.com/file/d/…/view" required/></label>
     <label>{'2. ' + t('Thumbnail (capa)')}<small>{t('JPG, PNG ou WebP')}</small><input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={pickCover} required/></label>
    </div>
    {(preview || coverUrl) && <div className={styles.preview}>
     {preview && <div className={styles.previewVideo}><iframe key={preview} title={t('Prévia do vídeo no Google Drive')} src={preview} allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div>}
     <div className={styles.previewCover}>{coverUrl ? <img src={coverUrl} alt={t('Prévia da capa escolhida')}/> : <div className={styles.emptyCover}><Win7Icon name="thumbnails" size={50}/> {t('Sem capa')}</div>}</div>
    </div>}
    {message && <div className={styles.message} data-status={status} role={status === 'error' ? 'alert' : 'status'}>{message}</div>}
    <div className={styles.actions}><Link href="/">{t('Voltar ao desktop')}</Link><button disabled={status === 'sending'} type="submit">{status === 'sending' ? t('Salvando...') : t('✓ Adicionar ao showcase')}</button></div>
    </fieldset>
   </form>
  </div>
 </div></main>;
}
