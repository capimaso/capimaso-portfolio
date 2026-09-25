export type Social = {
  id: string;
  name: string;
  value: string;
  href?: string;
  copyable?: boolean;
};
export const socials: Social[] = [
  { id: 'email', name: 'EMAIL', value: 'tduartedacunha@gmail.com', href: 'mailto:tduartedacunha@gmail.com', copyable: true },
  { id: 'instagram', name: 'INSTAGRAM', value: '@capimaso', href: 'https://instagram.com/capimaso', copyable: true },
  { id: 'discord', name: 'DISCORD', value: 'capimaso', copyable: true },
  { id: 'youtube', name: 'YOUTUBE', value: 'capimaso', href: 'https://youtube.com/@capimaso', copyable: true }
];
