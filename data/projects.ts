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
    id: 'scarface',
    filename: 'SCARFACE',
    title: '3 Programas que todo PC Gamer deveria ter',
    category: 'GAMING',
    description: 'Primeiro vídeo em formato curto editado por mim.',
    software: ['Adobe Premiere Pro'],
    thumbnail: '/images/scarfaceThumb.png',
    video: 'https://www.instagram.com/reel/Ddo2T6JTP51/?stkn=MzRlODBiNWFlZA==',
    format: 'short',
    platform: 'instagram'
  },
  {
    id: 'megluuh',
    filename: '03_LONG_FORM',
    title: 'A tríade do caos: Huntress, Nurse e Billy - Dead by Daylight',
    category: 'GAMING',
    description: 'Editei esse vídeo para uma amiga de longa data que faz live-streams, apenas para usar como portfólio.',
    software: ['Adobe Premiere Pro'],
    video: 'https://www.youtube.com/watch?v=en9sRuniY1U&t=3s',
    format: 'long',
    platform: 'youtube'
  },
  {
    id: 'tranzit',
    filename: 'TRANZIT',
    title: 'Tentamos fazer o EASTER EGG do TRANZIT (e não deu muito certo)',
    category: 'GAMING',
    description: 'Meu primeiro vídeo editado, não tinha noção nem como mudar o framerate da timeline, nem sobre o bitrate após exportar.',
    software: ['Adobe Premiere Pro'],
    video: 'https://www.youtube.com/watch?v=Mj67WzDsaP4&t=1s',
    format: 'long',
    platform: 'youtube'
  }
];
