'use client';

import { useCallback, useEffect, useReducer, useState, type RefObject } from 'react';
import { activeWindow, initialWindows, windowReducer } from './window-state';
import type { AppId } from './types';
import type { PhotoFolder, PhotoSelection } from '@/src/lib/photos';

/** React owns state and DOM; the hook is the adapter between the engine and shell. */
export function useWindowManager(workspace: RefObject<HTMLDivElement | null>) {
  const [state, dispatch] = useReducer(windowReducer, initialWindows);
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
  }, [workspace]);

  const open = useCallback((id: AppId, selection?: PhotoSelection) => dispatch({ type: 'open', id, area, selection }), [area]);
  const browse = useCallback((folder: PhotoFolder[]) => dispatch({ type: 'open', id: 'photos', area, folder }), [area]);
  const close = useCallback((id: AppId) => dispatch({ type: 'close', id }), []);
  const task = useCallback((id: AppId) => dispatch({ type: 'task', id }), []);
  const showDesktop = useCallback(() => dispatch({ type: 'desktop' }), []);
  return { state, dispatch, area, compact, activeId: activeWindow(state.windows), open, browse, close, task, showDesktop };
}
