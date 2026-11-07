'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ShowcaseItem } from '@/lib/showcase';
import type { Thumbnail } from '@/lib/thumbnails';

export type MediaCatalog = { showcase: ShowcaseItem[]; thumbnails: Thumbnail[]; introduction?: ShowcaseItem };
export type MediaSelection = { kind: 'video'; id: string } | { kind: 'thumbnail'; src: string };

const CatalogContext = createContext<MediaCatalog>({ showcase: [], thumbnails: [] });
export const useMediaCatalog = () => useContext(CatalogContext);

export default function MediaCatalogProvider({ catalog, children }: { catalog: MediaCatalog; children: ReactNode }) {
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}
