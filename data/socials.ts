export type Social = {
  id: string;
  name: string;
  value: string;
  href: string;
  copyable?: boolean;
};

export const socials: Social[] = [
  { id: 'email', name: 'EMAIL', value: 'YOUR_EMAIL_HERE', href: 'mailto:YOUR_EMAIL_HERE', copyable: true },
  { id: 'instagram', name: 'INSTAGRAM', value: 'YOUR_INSTAGRAM_HERE', href: 'https://instagram.com/YOUR_INSTAGRAM_HERE' },
  { id: 'discord', name: 'DISCORD', value: 'YOUR_DISCORD_HERE', href: '#', copyable: true },
  { id: 'youtube', name: 'YOUTUBE', value: 'YOUR_YOUTUBE_HERE', href: 'https://youtube.com/@YOUR_YOUTUBE_HERE' }
];
