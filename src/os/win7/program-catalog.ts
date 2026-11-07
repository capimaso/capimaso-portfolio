import { applications, windowApplications } from './types';

export const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const aliases: Record<string, string> = {
  controlPanel: 'control panel settings painel controle configurações personalization sound som aparência',
  photos: 'fotos photos pictures imagens bibliotecas libraries',
  videos: 'videos vídeos curtos longos shorts reels movies filmes',
  thumbnails: 'thumbnails thumbs miniaturas capas design',
  notepad: 'notepad notas texto text',
  calculator: 'calculator calc calculadora',
  about: 'sobre about perfil profile softwares photoshop programas serviços services preços prices recados guestbook equipamento equipment câmera camera',
  contact: 'contato contact email',
  recycle: 'lixeira recycle bin',
};

export function searchPrograms(query: string, translate: (label: string) => string, allPrograms = false) {
  const needle = normalizeSearch(query);
  return windowApplications.filter(app => !['photoViewer', 'videoPlayer', 'thumbnailViewer'].includes(app.id)
    && (allPrograms || needle || applications.some(item => item.id === app.id && item.id !== 'recycle'))
    && normalizeSearch(`${translate(app.label)} ${app.label} ${aliases[app.id] || ''}`).includes(needle));
}
