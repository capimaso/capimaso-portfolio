import '@/src/os/win7/seven.css';
import { availableWin7Sounds } from '@/src/server/win7-sounds';
import Win7Desktop from '@/src/os/win7/Win7Desktop';
import { getShowcase } from '@/lib/showcase';
import { getThumbnails } from '@/lib/thumbnails';
import { introduction } from '@/data/win7-profile';
import { tr } from '@/lib/locale-dictionary';
import styles from '@/src/os/win7/win7.module.css';
import { getSiteURL, homeMetadata } from '@/lib/site-metadata';
import { withVideoCovers } from '@/src/server/video-covers';

export const metadata = homeMetadata(getSiteURL());

export default function Home() {
  return <>
    <Win7Desktop availableSounds={availableWin7Sounds()} catalog={{ showcase: withVideoCovers(getShowcase()), thumbnails: getThumbnails(), introduction: withVideoCovers([introduction])[0] }} />
    <noscript><p className={styles.noScript}>{tr('en', 'Ative o JavaScript para usar as janelas.')}</p></noscript>
  </>;
}
