'use client';

import type { PhotoSelection } from '@/src/lib/photos';
import { photoImageURL } from '@/src/lib/photos';
import styles from '../win7.module.css';

export default function PhotoViewer({ selection }: { selection: PhotoSelection }) {
  const image = selection.images[selection.index];
  return <div className={styles.photoViewer}><img src={photoImageURL(image.id, 'original', false, selection.path)} alt={image.name} /></div>;
}
