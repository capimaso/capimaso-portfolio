'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { profile } from '@/data/profile';
import { win7Profile } from '@/data/win7-profile';
import { skills } from '@/data/skills';
import { services, shortPackages } from '@/data/services';
import { comments } from '@/data/comments';
import { useT } from '@/src/shared/LanguageContext';
import type { AppId } from '../types';
import { useMediaCatalog, type MediaSelection } from '../MediaCatalog';
import Win7Icon from '../Win7Icon';
import styles from './profile.module.css';

const tabs = [
  { id: 'about', label: 'Sobre mim' },
  { id: 'software', label: 'Programas' },
  { id: 'services', label: 'Serviços' },
  { id: 'equipment', label: 'Equipamento' },
  { id: 'guestbook', label: 'Recados' },
] as const;
type Tab = typeof tabs[number]['id'];

export default function Profile({ onOpen, onMedia }: { onOpen: (id: AppId) => void; onMedia: (selection: MediaSelection) => void }) {
  const t = useT();
  const { introduction } = useMediaCatalog();
  const [active, setActive] = useState<Tab>('about');
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const visibleTabs = tabs.filter(tab => tab.id !== 'equipment' || win7Profile.equipment.length > 0);
  function navigate(event: KeyboardEvent, index: number) {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % visibleTabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + visibleTabs.length) % visibleTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = visibleTabs.length - 1;
    else return;
    event.preventDefault(); setActive(visibleTabs[next].id); buttons.current[next]?.focus();
  }

  return <article className={styles.profile} data-win7-profile>
    <header className={styles.identity}>
      <img src="/images/profile.jpg" width={80} height={80} alt={profile.brand} />
      <div><h1>{profile.name} / {profile.brand}</h1><p>{t(win7Profile.role)}</p>
        <span className={styles.availability}>{t(profile.status)}</span></div>
    </header>
    <div className={styles.tabs} role="tablist" aria-label={t('Meu perfil')}>
      {visibleTabs.map((tab, index) => <button type="button" role="tab" key={tab.id}
        id={`profile-tab-${tab.id}`} aria-controls={`profile-panel-${tab.id}`} aria-selected={active === tab.id}
        tabIndex={active === tab.id ? 0 : -1} ref={element => { buttons.current[index] = element; }}
        onClick={() => setActive(tab.id)} onKeyDown={event => navigate(event, index)}>{t(tab.label)}</button>)}
    </div>
    {visibleTabs.map(tab => <section className={styles.panel} key={tab.id} role="tabpanel" tabIndex={0}
      hidden={active !== tab.id} id={`profile-panel-${tab.id}`} aria-labelledby={`profile-tab-${tab.id}`}>
      {tab.id === 'about' && <>
        <h2>{t(profile.tagline)}</h2><p>{t(profile.bio)}</p>
        <nav className={styles.actions} aria-label={t('Meu portfólio')}>
          {([
            ['videos', 'Vídeos'], ['photos', 'Fotografias'], ['thumbnails', 'Thumbnails'], ['contact', 'Contato'],
          ] as const).map(([id, label]) => <button type="button" key={id} onClick={() => onOpen(id)}><Win7Icon name={id} size={24} />{t(label)}</button>)}
          {introduction && <button type="button" onClick={() => onMedia({ kind: 'video', id: introduction.id })}>
            <Win7Icon name="videoPlayer" size={24} />{t('Vídeo de apresentação')}</button>}
        </nav>
      </>}
      {tab.id === 'software' && <>
        <h2>{t('Programas instalados')}</h2>
        <ul className={styles.software}>{skills.map(software => <li key={software.name}>
          <Win7Icon name="controlPanel" size={32} /><div><h3>{software.name}</h3><p>{t(software.detail)}</p></div><span>{t(software.category)}</span>
        </li>)}</ul>
      </>}
      {tab.id === 'services' && <>
        <h2>{t('Serviços de edição')}</h2><p>{t('Escolha um formato. Para um orçamento, fale comigo.')}</p>
        <table className={styles.prices}><caption>{t('Serviços de edição')}</caption>
          <thead><tr><th scope="col">{t('Serviço')}</th><th scope="col">{t('Valor')}</th></tr></thead>
          <tbody>{services.map(service => <tr key={service.name}><td><strong>{t(service.name)}</strong><small>{t(service.detail)}</small></td><td>{t(service.price)}</td></tr>)}</tbody>
        </table>
        <table className={styles.prices}><caption>{t('Pacotes de vídeos curtos')} — {t('até 60 segundos cada')}</caption>
          <thead><tr><th scope="col">{t('Quantidade')}</th><th scope="col">{t('Valor')}</th></tr></thead>
          <tbody>{shortPackages.map(([quantity, price]) => <tr key={quantity}><td>{quantity} {t(quantity === '1' ? 'vídeo' : 'vídeos')}</td><td>{price}</td></tr>)}</tbody>
        </table>
        <p>{t('Prazos, revisões e necessidades específicas: a combinar. Preços do portfólio original.')}</p>
        <button type="button" onClick={() => onOpen('contact')}>{t('Entrar em contato')}</button>
      </>}
      {tab.id === 'equipment' && <><h2>{t('Equipamento')}</h2><dl className={styles.equipment}>
        {win7Profile.equipment.map(equipment => <div key={equipment.name}><dt>{t(equipment.name)}</dt><dd>{equipment.model}</dd></div>)}
      </dl></>}
      {tab.id === 'guestbook' && <><h2>{t('Recados')} ({comments.length})</h2>
        {comments.map(comment => <article className={styles.comment} key={comment.id}>
          {comment.avatar && <img src={comment.avatar.startsWith('/') ? comment.avatar : `/images/avatars/${comment.avatar}`} width={48} height={48} alt={comment.name} loading="lazy" />}
          <div><header>{comment.link ? <a href={comment.link} target="_blank" rel="noopener noreferrer">{comment.name}</a> : <strong>{comment.name}</strong>}
            {comment.date && <time>{comment.date}</time>}</header><p>{t(comment.comment)}</p></div>
        </article>)}
      </>}
    </section>)}
  </article>;
}
