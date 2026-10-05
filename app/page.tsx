import Desktop from '@/components/Desktop';
import { LanguageProvider } from '@/lib/i18n';
import { getThumbnails } from '@/lib/thumbnails';

export default function Home() {
  // Reads every image inside public/images/thumbs/ on the server.
  const thumbnails = getThumbnails();
  return (
    <LanguageProvider>
      <Desktop thumbnails={thumbnails} />
    </LanguageProvider>
  );
}
