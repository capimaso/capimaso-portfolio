import { windowApplications as applications, type AppId, type AppWindow, type Bounds, type WorkArea } from './types';
import type { PhotoSelection } from '@/src/lib/photos';
import { fitBounds } from './window-geometry';
export { fitBounds } from './window-geometry';

export type WindowState = { windows: AppWindow[]; desktopRestore: AppId[] };
export type WindowAction =
  | { type: 'open'; id: AppId; area: WorkArea; selection?: PhotoSelection }
  | { type: 'focus' | 'close' | 'minimize' | 'maximize' | 'task'; id: AppId }
  | { type: 'bounds'; id: AppId; bounds: Bounds }
  | { type: 'fit'; area: WorkArea }
  | { type: 'desktop' };

export const initialWindows: WindowState = { windows: [], desktopRestore: [] };
export const activeWindow = (windows: AppWindow[]) => [...windows].reverse().find(win => !win.minimized)?.id;

function focus(windows: AppWindow[], id: AppId) {
  if (activeWindow(windows) === id) return windows;
  const found = windows.find(win => win.id === id);
  return found ? [...windows.filter(win => win.id !== id), { ...found, minimized: false }] : windows;
}

export function windowReducer(state: WindowState, action: WindowAction): WindowState {
  const windows = state.windows;
  switch (action.type) {
    case 'open': {
      if (windows.some(win => win.id === action.id)) return { windows: focus(windows.map(win => win.id === action.id && action.selection ? { ...win, selection: action.selection } : win), action.id), desktopRestore: [] };
      const app = applications.find(app => app.id === action.id)!;
      const offset = (windows.length % 5) * 26;
      const bounds = fitBounds({ x: 120 + offset, y: 55 + offset, width: app.width, height: app.height }, action.area);
      return { windows: [...windows, { id: action.id, bounds, minimized: false, maximized: false, ...(action.selection ? { selection: action.selection } : {}) }], desktopRestore: [] };
    }
    case 'focus': {
      const next = focus(windows, action.id);
      return next === windows ? state : { ...state, windows: next };
    }
    case 'close': return { windows: windows.filter(win => win.id !== action.id), desktopRestore: state.desktopRestore.filter(id => id !== action.id) };
    case 'minimize': return { ...state, windows: windows.map(win => win.id === action.id ? { ...win, minimized: true } : win) };
    case 'maximize': return { ...state, windows: focus(windows.map(win => win.id === action.id ? { ...win, maximized: !win.maximized } : win), action.id) };
    case 'task': return activeWindow(windows) === action.id
      ? windowReducer(state, { type: 'minimize', id: action.id })
      : { ...state, windows: focus(windows, action.id) };
    case 'bounds': {
      if (!Object.values(action.bounds).every(Number.isFinite)) return state;
      return { ...state, windows: windows.map(win => win.id === action.id && !win.maximized && !win.minimized ? { ...win, bounds: action.bounds } : win) };
    }
    case 'fit': return { ...state, windows: windows.map(win => ({ ...win, bounds: fitBounds(win.bounds, action.area) })) };
    case 'desktop': {
      const visible = windows.filter(win => !win.minimized).map(win => win.id);
      if (visible.length) return { windows: windows.map(win => ({ ...win, minimized: true })), desktopRestore: visible };
      return { windows: windows.map(win => state.desktopRestore.includes(win.id) ? { ...win, minimized: false } : win), desktopRestore: [] };
    }
  }
}
