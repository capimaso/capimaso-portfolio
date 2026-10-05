import fs from 'node:fs';
import path from 'node:path';

export type ThumbnailImage = {
  name: string; // file name, e.g. "my-thumb.png"
  src: string;  // public URL, e.g. "/images/thumbs/my-thumb.png"
};

// 🔧 Every image inside this folder shows up automatically in My Work → THUMBNAILS.
// Folder on disk: public/images/thumbs/
const THUMBS_FOLDER = 'images/thumbs';
const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif|avif|svg|bmp)$/i;

export function getThumbnails(): ThumbnailImage[] {
  const absolute = path.join(process.cwd(), 'public', THUMBS_FOLDER);
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(absolute, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((entry) => entry.isFile() && !entry.name.startsWith('.') && IMAGE_EXTENSIONS.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((name) => ({ name, src: `/${THUMBS_FOLDER}/${encodeURIComponent(name)}` }));
}
