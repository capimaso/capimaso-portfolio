import type { PhotoFolder, PhotoSelection } from '@/src/lib/photos';
import type { MediaSelection } from './MediaCatalog';

export type DesktopAppId = 'photos' | 'videos' | 'thumbnails' | 'about' | 'contact' | 'recycle';
export type AppId = DesktopAppId | 'photoViewer' | 'videoPlayer' | 'thumbnailViewer' | 'calculator' | 'notepad' | 'controlPanel';
export type Bounds = { x: number; y: number; width: number; height: number };
export type WorkArea = { width: number; height: number };
export type AppWindow = { id: AppId; bounds: Bounds; minimized: boolean; maximized: boolean; minimizeTarget?: 'taskbar' | 'desktop'; selection?: PhotoSelection; folder?: PhotoFolder[]; media?: MediaSelection };

export const applications: { id: DesktopAppId; label: string; width: number; height: number }[] = [
  { id: 'photos', label: 'Fotografias', width: 820, height: 560 },
  { id: 'videos', label: 'Vídeos', width: 860, height: 600 },
  { id: 'thumbnails', label: 'Thumbnails', width: 820, height: 560 },
  { id: 'about', label: 'Meu perfil', width: 780, height: 640 },
  { id: 'contact', label: 'Contato', width: 680, height: 460 },
  { id: 'recycle', label: 'Lixeira', width: 560, height: 400 },
];

export const windowApplications: { id: AppId; label: string; width: number; height: number }[] = [
  ...applications,
  { id: 'controlPanel', label: 'Painel de controle', width: 1000, height: 650 },
  { id: 'calculator', label: 'Calculadora', width: 340, height: 400 },
  { id: 'notepad', label: 'Bloco de notas', width: 640, height: 450 },
  { id: 'photoViewer', label: 'Visualizador de Fotos do Windows', width: 940, height: 650 },
  { id: 'videoPlayer', label: 'Windows Media Player', width: 900, height: 660 },
  { id: 'thumbnailViewer', label: 'Visualizador de thumbnails', width: 940, height: 650 },
];
