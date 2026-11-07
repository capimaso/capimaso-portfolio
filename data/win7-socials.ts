import { socials } from './socials';

/** Win7 unifica os contatos reais de edição e fotografia; o XP mantém seus dados. */
export const win7Socials = socials.flatMap(social => social.id === 'instagram'
  ? [
    { ...social, id: 'instagram-video', name: 'Instagram · edição de vídeo' },
    { ...social, name: 'Instagram · fotografia', value: '@capimaso.jpg', href: 'https://instagram.com/capimaso.jpg' },
  ]
  : [social]);
