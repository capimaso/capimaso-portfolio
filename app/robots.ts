import type { MetadataRoute } from 'next';
import { getSiteURL } from '@/lib/site-metadata';

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteURL();
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/studio'] },
    sitemap: origin ? new URL('/sitemap.xml', origin).href : undefined,
  };
}
