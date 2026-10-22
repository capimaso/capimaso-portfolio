import XpDesktop from '@/src/os/xp/XpDesktop';
import { getThumbnails } from '@/lib/thumbnails';
import { getShowcase } from '@/lib/showcase';

export default function XpPage() {
  return <XpDesktop thumbnails={getThumbnails()} showcase={getShowcase()} />;
}
