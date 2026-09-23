export type Skill = {
  name: string;
  category: string;
  description: string;
  specialty: string;
};

export const skills: Skill[] = [
  { name: 'Adobe Premiere Pro', category: 'EDITING', description: 'Primary editing workflow.', specialty: 'TIMELINE / CUTS / PACING' },
  { name: 'Adobe After Effects', category: 'MOTION', description: 'Motion and compositing workflow.', specialty: 'MOTION / COMPOSITING' },
  { name: 'Adobe Photoshop', category: 'IMAGE', description: 'Image and visual asset work.', specialty: 'THUMBNAILS / ASSETS' }
];
