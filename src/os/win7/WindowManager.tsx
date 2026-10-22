import type { Dispatch } from 'react';
import type { AppId, AppWindow, WorkArea } from './types';
import type { WindowAction } from './window-state';
import WindowChrome from './WindowChrome';
import AppContent from './apps/AppContent';

type Props = {
  windows: AppWindow[]; activeId?: AppId; compact: boolean; area: WorkArea;
  dispatch: Dispatch<WindowAction>; onOpen: (id: AppId) => void; onClose: (id: AppId) => void;
};

export default function WindowManager({ windows, activeId, compact, area, dispatch, onOpen, onClose }: Props) {
  return windows.map((win, index) => <WindowChrome key={win.id} window={win} order={index} active={win.id === activeId}
    compact={compact} area={area} onFocus={() => dispatch({ type: 'focus', id: win.id })}
    onClose={() => onClose(win.id)} onMinimize={() => dispatch({ type: 'minimize', id: win.id })}
    onMaximize={() => dispatch({ type: 'maximize', id: win.id })}
    onBounds={bounds => dispatch({ type: 'bounds', id: win.id, bounds })}>
    <AppContent id={win.id} onOpen={onOpen} />
  </WindowChrome>);
}
