import { socials } from './socials';

/** Photography contact; the XP video portfolio keeps its existing profile. */
export const win7Socials = socials.map(social => social.id === 'instagram'
  ? { ...social, value: '@capimaso.jpg', href: 'https://instagram.com/capimaso.jpg' }
  : social);
