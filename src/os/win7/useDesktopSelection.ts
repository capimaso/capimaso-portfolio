'use client';

import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react';
import type { AppId } from './types';

type Box = { left: number; top: number; width: number; height: number };

/** A desktop-only mouse gesture; window, taskbar and touch events keep their handlers. */
export function useDesktopSelection(root: RefObject<HTMLElement | null>, workspace: RefObject<HTMLDivElement | null>,
  shortcuts: RefObject<(HTMLButtonElement | null)[]>, onSelect: (ids: AppId[]) => void) {
  const [box, setBox] = useState<Box | null>(null);
  const drag = useRef<{
    pointer: number; node: HTMLElement; origin: { x: number; y: number }; bounds: DOMRect;
    shell: DOMRect; icons: { id: AppId; rect: DOMRect }[];
    latest: { x: number; y: number }; moved: boolean;
  } | null>(null);
  const frame = useRef<number | null>(null);

  function update() {
    const current = drag.current;
    if (!current) return;
    const { origin, latest, shell } = current;
    if (!current.moved && Math.hypot(latest.x - origin.x, latest.y - origin.y) < 3) return;
    current.moved = true;
    const left = Math.min(origin.x, latest.x), top = Math.min(origin.y, latest.y);
    const right = Math.max(origin.x, latest.x), bottom = Math.max(origin.y, latest.y);
    setBox({ left: left - shell.left, top: top - shell.top, width: right - left, height: bottom - top });
    onSelect(current.icons.filter(({ rect }) => rect.left <= right && rect.right >= left
      && rect.top <= bottom && rect.bottom >= top).map(icon => icon.id));
  }

  function finish() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    const current = drag.current;
    drag.current = null;
    if (current?.node.hasPointerCapture(current.pointer)) current.node.releasePointerCapture(current.pointer);
    setBox(null);
  }

  useEffect(() => {
    const cancel = () => finish();
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') finish(); };
    window.addEventListener('blur', cancel);
    window.addEventListener('resize', cancel);
    window.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('blur', cancel); window.removeEventListener('resize', cancel); window.removeEventListener('keydown', escape);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      const current = drag.current;
      drag.current = null;
      if (current?.node.hasPointerCapture(current.pointer)) current.node.releasePointerCapture(current.pointer);
    };
  }, []);

  function position(event: PointerEvent<HTMLElement>) {
    const current = drag.current;
    if (!current || current.pointer !== event.pointerId) return false;
    current.latest = { x: Math.max(current.bounds.left, Math.min(current.bounds.right, event.clientX)),
      y: Math.max(current.bounds.top, Math.min(current.bounds.bottom, event.clientY)) };
    return true;
  }

  return { box,
    onPointerDown(event: PointerEvent<HTMLElement>) {
      const target = event.target as HTMLElement;
      if (drag.current || event.button !== 0 || !event.isPrimary
        || (target !== root.current && !target.hasAttribute('data-desktop-icons'))) return;
      onSelect([]);
      if (event.pointerType !== 'mouse' || !root.current || !workspace.current) return;
      const bounds = workspace.current.getBoundingClientRect();
      if (event.clientY > bounds.bottom) return;
      event.preventDefault();
      const origin = { x: event.clientX, y: event.clientY };
      drag.current = { pointer: event.pointerId, node: event.currentTarget, origin, latest: origin, moved: false,
        bounds, shell: root.current.getBoundingClientRect(), icons: shortcuts.current.flatMap(icon => icon
          ? [{ id: icon.dataset.shortcut as AppId, rect: icon.getBoundingClientRect() }] : []) };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (!position(event) || frame.current !== null) return;
      frame.current = requestAnimationFrame(() => { frame.current = null; update(); });
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      if (!position(event)) return;
      update(); finish();
    },
    onPointerCancel(event: PointerEvent<HTMLElement>) { if (drag.current?.pointer === event.pointerId) finish(); },
    onLostPointerCapture(event: PointerEvent<HTMLElement>) { if (drag.current?.pointer === event.pointerId) finish(); },
  };
}
