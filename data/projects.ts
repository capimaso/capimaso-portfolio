export type Project = {
  id: string;
  filename: string;
  title: string;
  category: string;
  description: string;
  software: string[];
  thumbnail?: string;
  video: string;
  format: 'short' | 'long';
  platform: 'youtube' | 'instagram';
};

// 🔧 ADD YOUR VIDEOS HERE.
// platform = 'youtube' for YouTube videos/Shorts or 'instagram' for Instagram Reels.
// format = 'short' for vertical 9:16 content or 'long' for horizontal 16:9 content.
// thumbnail is optional. YouTube thumbnails are detected automatically when omitted.
// For Instagram, add your own thumbnail path (for example: /images/my-reel.jpg).
export const projects: Project[] = [
  {
    id: 'gaming-edit',
    filename: 'SCARFACE',
    title: '3 PROGRAMAS que todo PC gamer deveria ter',
    category: 'GAMING',
    description: 'Minha primeira edição em vídeos curtos, foram 2 dias para pensar na parte criativa e editar.',
    software: ['Adobe Premiere Pro'],
    thumbnail: '/images/scarfaceThumb.svg',
    video: 'https://www.instagram.com/reel/Ddo2T6JTP51/?stkn=MzRlODBiNWFlZA==',
    format: 'short',
    platform: 'instagram'
  },
  {
    id: 'megluh-video',
    filename: 'MEGLUUH',
    title: 'A tríade do caos: Huntress, Nurse e Billy - Dead by Daylight',
    category: 'GAMING',
    description: 'Editei esse vídeo de graça como portfólio para uma amiga de longa data que faz live-streams.',
    software: ['Adobe Premiere Pro'],
    thumbnail: '',
    video: 'https://www.youtube.com/watch?v=en9sRuniY1U&t=2s',
    format: 'long',
    platform: 'youtube'
  },
  {
    id: 'my-first-video',
    filename: 'TRANZIT',
    title: 'Tentamos fazer o EASTER EGG do TRANZIT (e não deu muito certo)',
    category: 'GAMING',
    description: 'Esse foi meu primeiro vídeo produzido, não sabia nem mudar a taxa de quadros e nem como exportar em alta qualidade, sempre que vejo ele, lembro o quanto aprendi desde então.',
    software: ['Adobe Premiere Pro'],
    thumbnail: '',
    video: 'https://youtu.be/Mj67WzDsaP4',
    format: 'long',
    platform: 'youtube'
  }
];
