export type WindowId =
  | 'welcome'
  | 'computer'
  | 'work'
  | 'about'
  | 'skills'
  | 'services'
  | 'contact'
  | 'recycle'
  | 'properties'
  | 'player';

export type WindowState = {
  id: WindowId;
  title: string;
  icon: 'computer' | 'folder' | 'video' | 'user' | 'gear' | 'service' | 'mail' | 'recycle' | 'program' | 'file' | 'play';
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
};
