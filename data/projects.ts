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
};

// 🔧 ADD YOUR YOUTUBE VIDEOS HERE.
// format = 'short' for vertical 9:16 Reels/Shorts or 'long' for horizontal 16:9 videos.
// thumbnail is optional. When omitted, the site tries to use the YouTube thumbnail automatically.
export const projects: Project[] = [
  {
    id: 'gaming-edit',
    filename: '01_GAMING_EDIT',
    title: 'Gaming Edit',
    category: 'GAMING',
    description: 'ADD YOUR PROJECT DESCRIPTION HERE.',
    software: ['Adobe Premiere Pro'],
    thumbnail: '/images/project-gaming.svg',
    video: '',
    format: 'short'
  },
  {
    id: 'short-form',
    filename: '02_SHORT_FORM',
    title: 'Short Form',
    category: 'SHORT-FORM',
    description: 'ADD YOUR PROJECT DESCRIPTION HERE.',
    software: ['Adobe Premiere Pro', 'Adobe After Effects'],
    thumbnail: '/images/project-short.svg',
    video: '',
    format: 'short'
  },
  {
    id: 'long-form',
    filename: '03_LONG_FORM',
    title: 'Long Form',
    category: 'LONG-FORM',
    description: 'ADD YOUR PROJECT DESCRIPTION HERE.',
    software: ['Adobe Premiere Pro'],
    thumbnail: '/images/project-long.svg',
    video: '',
    format: 'long'
  },
  {
    id: 'motion-graphics',
    filename: '04_MOTION_GRAPHICS',
    title: 'Motion Graphics',
    category: 'MOTION',
    description: 'ADD YOUR PROJECT DESCRIPTION HERE.',
    software: ['Adobe After Effects'],
    thumbnail: '/images/project-motion.svg',
    video: '',
    format: 'short'
  },
  {
    id: 'creator-content',
    filename: '05_CREATOR_CONTENT',
    title: 'Creator Content',
    category: 'CREATOR',
    description: 'ADD YOUR PROJECT DESCRIPTION HERE.',
    software: ['Adobe Premiere Pro'],
    thumbnail: '/images/project-creator.svg',
    video: '',
    format: 'long'
  }
];
