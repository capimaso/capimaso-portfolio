import { applications, windowApplications } from './types';

export const normalizeSearch = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const aliases: Record<string, string> = {
  photos: 'fotos photos pictures imagens bibliotecas libraries',
  notepad: 'notepad notas texto text',
  calculator: 'calculator calc calculadora',
  about: 'sobre about perfil profile',
  contact: 'contato contact email',
  games: 'games jogos',
  recycle: 'lixeira recycle bin',
};

export function searchPrograms(query: string, translate: (label: string) => string, allPrograms = false) {
  const needle = normalizeSearch(query);
  return windowApplications.filter(app => app.id !== 'photoViewer'
    && (allPrograms || needle || applications.some(item => item.id === app.id && item.id !== 'recycle'))
    && normalizeSearch(`${translate(app.label)} ${app.label} ${aliases[app.id] || ''}`).includes(needle));
}
