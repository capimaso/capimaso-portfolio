'use client';

import { useEffect, useRef, type PointerEvent } from 'react';
import type { AppWindow, Bounds, WorkArea } from './types';
import { gestureBounds, type ResizeDirection } from './window-geometry';

type Gesture = { pointerId: number; x: number; y: number; bounds: Bounds; direction?: ResizeDirection; target: HTMLDivElement };

export function useWindowGesture(win: AppWindow, compact: boolean, area: WorkArea, onFocus: () => void, onBounds: (bounds: Bounds) => void) {
  const gesture = useRef<Gesture | null>(null);
  const pending = useRef<Bounds | null>(null);
  const frame = useRef<number | null>(null);
  const publish = useRef(onBounds);
  useEffect(() => { publish.current = onBounds; }, [onBounds]);
  const disabled = compact || win.maximized || win.minimized;

  function flush() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    if (pending.current) publish.current(pending.current);
    pending.current = null;
  }
  function cancel() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null; pending.current = null;
    const drag = gesture.current;
    gesture.current = null;
    if (drag?.target.hasPointerCapture(drag.pointerId)) drag.target.releasePointerCapture(drag.pointerId);
  }
  useEffect(() => cancel, [disabled, area.width, area.height]);

  function start(event: PointerEvent<HTMLDivElement>, direction?: ResizeDirection) {
    if (disabled || gesture.current || event.button !== 0 || !event.isPrimary || (event.target as HTMLElement).closest('button')) return;
    event.preventDefault(); event.stopPropagation(); onFocus();
    gesture.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, bounds: win.bounds, direction, target: event.currentTarget };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const drag = gesture.current;
    if (!drag || drag.pointerId !== event.pointerId || disabled) return;
    pending.current = gestureBounds(drag.bounds, area, event.clientX - drag.x, event.clientY - drag.y, drag.direction);
    if (frame.current === null) frame.current = requestAnimationFrame(flush);
  }
  function end(event: PointerEvent<HTMLDivElement>) {
    if (gesture.current?.pointerId !== event.pointerId) return;
    move(event); flush(); cancel();
  }
  function abort(event: PointerEvent<HTMLDivElement>) {
    if (gesture.current?.pointerId === event.pointerId) cancel();
  }
  return { start, handlers: { onPointerMove: move, onPointerUp: end, onPointerCancel: abort, onLostPointerCapture: abort } };
}
