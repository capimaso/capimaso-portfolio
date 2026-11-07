import type { MetadataRoute } from 'next';
import { getSiteURL } from '@/lib/site-metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteURL();
  return origin ? [{ url: origin.href }] : [];
}
