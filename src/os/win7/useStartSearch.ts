'use client';

import { useEffect, useRef, useState } from 'react';
import type { PhotoListing } from '@/src/lib/photos';
import { fetchPhotoListing } from './apps/photo-client';
import { useSoundManager } from './SoundManager';

/** Search root folders only; do not crawl the photo tree or download images. */
export function useStartSearch(open: boolean, query: string) {
  const sounds = useSoundManager();
  const [listing, setListing] = useState<PhotoListing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [revision, setRevision] = useState(0);
  const cached = useRef<{ data: PhotoListing; expires: number } | null>(null);
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    setError(null);
    if (!open || !query.trim()) { setListing(null); setLoading(false); return; }
    if (cached.current && cached.current.expires > Date.now()) { setListing(cached.current.data); setLoading(false); return; }
    const controller = new AbortController();
    request.current = controller;
    setListing(null); setLoading(true);
    const timer = setTimeout(() => {
      void fetchPhotoListing({}, { signal: controller.signal }).then(data => {
        if (controller.signal.aborted) return;
        cached.current = { data, expires: Date.now() + 60_000 }; setListing(data);
      }).catch(failure => { if (!controller.signal.aborted) { setError(failure); sounds.play('error'); } })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [open, query, revision, sounds]);

  async function loadMore() {
    if (loading || !listing?.nextPageToken) return;
    const controller = new AbortController();
    request.current?.abort(); request.current = controller;
    setLoading(true); setError(null);
    try {
      const result = await fetchPhotoListing({}, { token: listing.nextPageToken, signal: controller.signal });
      if (controller.signal.aborted) return;
      const data = { ...result, items: [...new Map([...listing.items, ...result.items].map(item => [item.id, item])).values()] };
      cached.current = { data, expires: Date.now() + 60_000 }; setListing(data);
    } catch (failure) { if (!controller.signal.aborted) { setError(failure); sounds.play('error'); } }
    finally { if (!controller.signal.aborted) setLoading(false); }
  }
  // Also covers pagination requests, whose controller differs from the effect's.
  useEffect(() => () => request.current?.abort(), [open, query, revision]);
  function retry() { cached.current = null; setRevision(value => value + 1); }
  return { listing, loading, error, loadMore, retry };
}
