export type Project = {
  id: string;
  filename: string;
  title: string;
  category: string;
  description: string;
  software: string[];
  thumbnail: string;
  video: string;
};

// 🔧 EDIT EACH PROJECT HERE.
// thumbnail = image shown in My Work + player poster
// video = video opened by the player
export const projects: Project[] = [
  {
    id: 'gaming-edit',
    filename: '01_GAMING_EDIT.mp4',
    title: 'Gaming Edit',
    category: 'GAMING',
    description: 'ADD YOUR PROJECT DESCRIPTION HERE.',
    software: ['Adobe Premiere Pro'],
    thumbnail: '/images/project-gaming.svg',
    video: '/videos/01_GAMING_EDIT.mp4'
  },
  {
    id: 'short-form',
    filename: '02_SHORT_FORM.mp4',
    title: 'Short Form',
    category: 'SHORT-FORM',
    description: 'ADD YOUR PROJECT DESCRIPTION HERE.',
    software: ['Adobe Premiere Pro', 'Adobe After Effects'],
    thumbnail: '/images/project-short.svg',
    video: '/videos/02_SHORT_FORM.mp4'
  },
  {
    id: 'long-form',
    filename: '03_LONG_FORM.mp4',
    title: 'Long Form',
    category: 'LONG-FORM',
    description: 'ADD YOUR PROJECT DESCRIPTION HERE.',
    software: ['Adobe Premiere Pro'],
    thumbnail: '/images/project-long.svg',
    video: '/videos/03_LONG_FORM.mp4'
  },
  {
    id: 'motion-graphics',
    filename: '04_MOTION_GRAPHICS.mp4',
    title: 'Motion Graphics',
    category: 'MOTION',
    description: 'ADD YOUR PROJECT DESCRIPTION HERE.',
    software: ['Adobe After Effects'],
    thumbnail: '/images/project-motion.svg',
    video: '/videos/04_MOTION_GRAPHICS.mp4'
  },
  {
    id: 'creator-content',
    filename: '05_CREATOR_CONTENT.mp4',
    title: 'Creator Content',
    category: 'CREATOR',
    description: 'ADD YOUR PROJECT DESCRIPTION HERE.',
    software: ['Adobe Premiere Pro'],
    thumbnail: '/images/project-creator.svg',
    video: '/videos/05_CREATOR_CONTENT.mp4'
  }
];
