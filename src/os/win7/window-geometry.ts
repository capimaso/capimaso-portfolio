import type { Bounds, WorkArea } from './types';

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export function fitBounds(bounds: Bounds, area: WorkArea): Bounds {
  const width = Math.min(Math.max(320, bounds.width), area.width);
  const height = Math.min(Math.max(200, bounds.height), area.height);
  return { width, height, x: Math.max(0, Math.min(bounds.x, area.width - width)), y: Math.max(0, Math.min(bounds.y, area.height - height)) };
}

export function gestureBounds(bounds: Bounds, area: WorkArea, dx: number, dy: number, direction?: ResizeDirection): Bounds {
  if (!direction) return fitBounds({ ...bounds, x: bounds.x + dx, y: bounds.y + dy }, area);
  let left = bounds.x, top = bounds.y, right = bounds.x + bounds.width, bottom = bounds.y + bounds.height;
  const minWidth = Math.min(320, area.width), minHeight = Math.min(200, area.height);
  if (direction.includes('w')) left = Math.max(0, Math.min(bounds.x + dx, right - minWidth));
  if (direction.includes('e')) right = Math.min(area.width, Math.max(right + dx, left + minWidth));
  if (direction.includes('n')) top = Math.max(0, Math.min(bounds.y + dy, bottom - minHeight));
  if (direction.includes('s')) bottom = Math.min(area.height, Math.max(bottom + dy, top + minHeight));
  return { x: left, y: top, width: right - left, height: bottom - top };
}
