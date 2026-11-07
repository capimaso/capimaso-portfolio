import { notFound } from 'next/navigation';
import Studio from '@/src/os/win7/studio/Studio';

export default function StudioPage() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <Studio />;
}
