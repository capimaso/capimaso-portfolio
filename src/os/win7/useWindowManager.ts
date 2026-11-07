'use client';

import { useCallback, useEffect, useReducer, useRef, useState, type RefObject } from 'react';
import { activeWindow, initialWindows, windowReducer, type WindowAction } from './window-state';
import { useSoundManager } from './SoundManager';
import type { AppId } from './types';
import type { MediaSelection } from './MediaCatalog';
import type { PhotoFolder, PhotoSelection } from '@/src/lib/photos';

/** React owns state and DOM; the hook is the adapter between the engine and shell. */
export function useWindowManager(workspace: RefObject<HTMLDivElement | null>) {
  const [state, reduce] = useReducer(windowReducer, initialWindows);
  const sounds = useSoundManager();
  const current = useRef(state);
  useEffect(() => { current.current = state; }, [state]);
  const dispatch = useCallback((action: WindowAction) => {
    const windows = current.current.windows;
    if ((action.type === 'minimize' && windows.some(win => win.id === action.id && !win.minimized))
      || (action.type === 'task' && activeWindow(windows) === action.id)
      || (action.type === 'desktop' && windows.some(win => !win.minimized))) sounds.play('minimize');
    reduce(action);
  }, [sounds]);
  const [area, setArea] = useState({ width: 1024, height: 728 });
  const compact = area.width < 720;

  useEffect(() => {
    const element = workspace.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const next = { width: element.clientWidth, height: element.clientHeight };
      if (!next.width || !next.height) return;
      setArea(current => current.width === next.width && current.height === next.height ? current : next);
      if (next.width >= 720) dispatch({ type: 'fit', area: next });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [workspace, dispatch]);

  const open = useCallback((id: AppId, selection?: PhotoSelection) => dispatch({ type: 'open', id, area, selection }), [area, dispatch]);
  const browse = useCallback((folder: PhotoFolder[]) => dispatch({ type: 'open', id: 'photos', area, folder }), [area, dispatch]);
  const openMedia = useCallback((media: MediaSelection) => dispatch({ type: 'open', id: media.kind === 'video' ? 'videoPlayer' : 'thumbnailViewer', area, media }), [area, dispatch]);
  const close = useCallback((id: AppId) => dispatch({ type: 'close', id }), [dispatch]);
  const task = useCallback((id: AppId) => dispatch({ type: 'task', id }), [dispatch]);
  const showDesktop = useCallback(() => dispatch({ type: 'desktop' }), [dispatch]);
  return { state, dispatch, area, compact, activeId: activeWindow(state.windows), open, openMedia, browse, close, task, showDesktop };
}
