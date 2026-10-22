import XpDesktop from '@/src/os/xp/XpDesktop';
import '@/src/os/xp/xp.css';
import { getThumbnails } from '@/lib/thumbnails';
import { getShowcase } from '@/lib/showcase';
export default function Home() {
  return <div className="xp-shell"><XpDesktop thumbnails={getThumbnails()} showcase={getShowcase()} /></div>;
}
