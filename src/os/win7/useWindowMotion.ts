'use client';

import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import type { AppWindow } from './types';

const normal = { transform: 'translate(0px, 0px) scale(1)', opacity: 1 };
type Rect = { x: number; y: number; width: number; height: number };

/** Animate only presentation; the reducer remains the source of saved geometry.
 * WAAPI lets a fast restore reverse the current visual frame without ghost DOM.
 */
export function useWindowMotion(panel: RefObject<HTMLElement | null>, win: AppWindow, compact: boolean) {
  const [hidden, setHidden] = useState(win.minimized);
  const running = useRef<Animation | null>(null);
  const previous = useRef({ minimized: win.minimized, maximized: compact || win.maximized, rect: null as Rect | null });

  useLayoutEffect(() => {
    const node = panel.current;
    if (!node) return;
    const before = previous.current;
    const maximized = compact || win.maximized;
    const visibilityChanged = before.minimized !== win.minimized;
    const sizeChanged = before.maximized !== maximized;
    if (!visibilityChanged && !sizeChanged) {
      if (!running.current && !win.minimized) before.rect = node.getBoundingClientRect();
      return;
    }
    // Changing between mobile/fullscreen and desktop must never reveal a hidden app.
    if (win.minimized && !visibilityChanged) {
      running.current?.cancel();
      running.current = null;
      node.hidden = true;
      node.style.willChange = '';
      setHidden(true);
      previous.current = { ...before, maximized };
      return;
    }

    const interrupted = running.current ? {
      transform: getComputedStyle(node).transform,
      opacity: Number(getComputedStyle(node).opacity),
    } : null;
    let oldRect = before.rect;
    if (interrupted && oldRect) {
      const matrix = new DOMMatrixReadOnly(interrupted.transform);
      oldRect = { x: oldRect.x + oldRect.width * (1 - matrix.a) / 2 + matrix.e,
        y: oldRect.y + oldRect.height * (1 - matrix.d) / 2 + matrix.f,
        width: oldRect.width * matrix.a, height: oldRect.height * matrix.d };
    }
    running.current?.cancel();
    running.current = null;
    node.hidden = false;
    const rect = node.getBoundingClientRect();
    previous.current = { minimized: win.minimized, maximized, rect };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !node.animate || !rect.width || !rect.height) {
      node.style.willChange = '';
      node.hidden = win.minimized;
      setHidden(win.minimized);
      return;
    }

    const shell = node.closest('main');
    const target = shell?.querySelector<HTMLElement>(win.minimizeTarget === 'desktop' ? '[data-show-desktop]' : `[data-task="${win.id}"]`);
    const destination = target?.getBoundingClientRect();
    // An overflowing task may be offscreen: keep the destination inside the viewport.
    const x = Math.max(0, Math.min(window.innerWidth, destination ? destination.x + destination.width / 2 : window.innerWidth - 6));
    const y = destination ? destination.y + destination.height / 2 : window.innerHeight - 20;
    const collapsed = { transform: `translate(${x - rect.x - rect.width / 2}px, ${y - rect.y - rect.height / 2}px) scale(.1)`, opacity: 0 };
    let frames: Keyframe[];
    if (visibilityChanged) {
      frames = win.minimized ? [interrupted || normal, collapsed] : [interrupted || collapsed, normal];
    } else {
      // FLIP maximization/restoration: render the new bounds, animate from the old rectangle.
      const from = oldRect || rect;
      frames = [{ transform: `translate(${from.x + from.width / 2 - rect.x - rect.width / 2}px, ${from.y + from.height / 2 - rect.y - rect.height / 2}px) scale(${from.width / rect.width}, ${from.height / rect.height})`, opacity: interrupted?.opacity ?? 1 }, normal];
    }
    setHidden(false);
    node.style.willChange = 'transform, opacity';
    const animation = node.animate(frames, { duration: 250, easing: 'ease-in-out', fill: 'both' });
    running.current = animation;
    animation.onfinish = () => {
      if (running.current !== animation) return;
      running.current = null;
      node.hidden = win.minimized;
      setHidden(win.minimized);
      animation.cancel();
      node.style.willChange = '';
      if (!win.minimized) previous.current.rect = node.getBoundingClientRect();
    };
  });

  useLayoutEffect(() => () => { running.current?.cancel(); }, []);
  return hidden;
}
