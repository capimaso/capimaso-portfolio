export type AppId = 'photos' | 'about' | 'contact' | 'games' | 'recycle';
export type Bounds = { x: number; y: number; width: number; height: number };
export type WorkArea = { width: number; height: number };
export type AppWindow = { id: AppId; bounds: Bounds; minimized: boolean; maximized: boolean };

export const applications: { id: AppId; label: string; width: number; height: number }[] = [
  { id: 'photos', label: 'Fotografias', width: 820, height: 560 },
  { id: 'about', label: 'Sobre', width: 640, height: 450 },
  { id: 'contact', label: 'Contato', width: 680, height: 460 },
  { id: 'games', label: 'Games', width: 760, height: 500 },
  { id: 'recycle', label: 'Lixeira', width: 560, height: 400 },
];
