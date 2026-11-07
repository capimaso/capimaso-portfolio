import 'server-only';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import type { ShowcaseItem } from '@/lib/showcase';

const extensions = ['png', 'jpg', 'jpeg', 'webp', 'avif'];
const coverPattern = /^([a-z0-9][a-z0-9_-]*)\.(png|jpe?g|webp|avif)$/i;

function coverNames(): string[] {
  try {
    return readdirSync(path.join(process.cwd(), 'public/images/posters/custom'), { withFileTypes: true })
      .filter(file => file.isFile()).map(file => file.name);
  } catch { return []; }
}

/** A cover named after the stable video ID takes priority over the original poster. */
export function withVideoCovers(items: ShowcaseItem[], names = coverNames()): ShowcaseItem[] {
  const files = names.filter(name => coverPattern.test(name)).sort((a, b) => {
    const priority = extensions.indexOf(a.split('.').at(-1)!.toLowerCase()) - extensions.indexOf(b.split('.').at(-1)!.toLowerCase());
    return priority || (a < b ? -1 : a > b ? 1 : 0);
  });
  const covers = new Map<string, string>();
  for (const file of files) {
    const id = coverPattern.exec(file)![1];
    if (!covers.has(id)) covers.set(id, file);
  }
  return items.map(item => {
    const file = covers.get(item.id);
    return file ? { ...item, thumbnail: `/images/posters/custom/${encodeURIComponent(file)}` } : item;
  });
}
