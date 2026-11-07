import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import { site } from '@/data/site';
import { tr } from './locale-dictionary';

/** Do not infer a public domain from request headers or a development fallback. */
export function getSiteURL(value = process.env.SITE_URL): URL | undefined {
  if (!value?.trim()) return undefined;
  const invalid = () => new Error('SITE_URL must be an absolute HTTP(S) origin, without credentials, path, query or fragment.');
  let url: URL;
  try { url = new URL(value.trim()); } catch { throw invalid(); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password
    || url.pathname !== '/' || url.search || url.hash) throw invalid();
  return url;
}

export function homeMetadata(origin?: URL): Metadata {
  const description = `${profile.name} / ${profile.brand}. ${tr('en', site.description)}`;
  // Absolute sharing URLs only exist once the actual public origin is known.
  const image = origin ? new URL(site.image, origin).href : undefined;
  return {
    metadataBase: origin,
    title: site.title,
    description,
    alternates: origin ? { canonical: origin.href } : undefined,
    openGraph: {
      title: site.title, description, type: 'website', siteName: profile.brand,
      locale: 'en_US', alternateLocale: ['pt_BR'], url: origin?.href,
      images: image ? [{ url: image, alt: site.title }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary', title: site.title, description,
      images: image ? [{ url: image, alt: site.title }] : undefined,
    },
  };
}
