import XpDesktop from '@/components/XpDesktop';
import { getThumbnails } from '@/lib/thumbnails';
import { getShowcase } from '@/lib/showcase';
export default function Home() {
  return <XpDesktop thumbnails={getThumbnails()} showcase={getShowcase()} />;
}
