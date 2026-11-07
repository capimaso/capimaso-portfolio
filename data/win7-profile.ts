import { media } from './media';
import type { ShowcaseItem } from '@/lib/showcase';

/** Complementos do perfil Win7. Preencher equipamento somente com os dados reais do proprietário. */
export const win7Profile: { role: string; equipment: { name: string; model: string }[] } = {
  role: 'Editor de vídeo e fotógrafo',
  equipment: [{ name: 'Câmera', model: 'Fujifilm FinePix S2800HD' }],
};

/** O vídeo original de apresentação fica separado da lista de trabalhos. */
export const introduction: ShowcaseItem = {
  id: 'intro',
  title: media.introduction.title,
  description: 'Conheça meu trabalho em vídeo.',
  category: 'Apresentação',
  format: 'long',
  video: media.introduction.video,
  thumbnail: media.introduction.thumbnail,
  software: '',
};
