import type { PhotoFolder, PhotoSelection } from '@/src/lib/photos';

export type DesktopAppId = 'photos' | 'about' | 'contact' | 'games' | 'recycle';
export type AppId = DesktopAppId | 'photoViewer' | 'calculator' | 'notepad' | 'controlPanel';
export type Bounds = { x: number; y: number; width: number; height: number };
export type WorkArea = { width: number; height: number };
export type AppWindow = { id: AppId; bounds: Bounds; minimized: boolean; maximized: boolean; selection?: PhotoSelection; folder?: PhotoFolder[] };

export const applications: { id: DesktopAppId; label: string; width: number; height: number }[] = [
  { id: 'photos', label: 'Fotografias', width: 820, height: 560 },
  { id: 'about', label: 'Sobre', width: 640, height: 450 },
  { id: 'contact', label: 'Contato', width: 680, height: 460 },
  { id: 'games', label: 'Games', width: 760, height: 500 },
  { id: 'recycle', label: 'Lixeira', width: 560, height: 400 },
];

export const windowApplications: { id: AppId; label: string; width: number; height: number }[] = [
  ...applications,
  { id: 'controlPanel', label: 'Painel de controle', width: 1000, height: 650 },
  { id: 'calculator', label: 'Calculadora', width: 340, height: 400 },
  { id: 'notepad', label: 'Bloco de notas', width: 640, height: 450 },
  { id: 'photoViewer', label: 'Visualizador de Fotos do Windows', width: 940, height: 650 },
];
