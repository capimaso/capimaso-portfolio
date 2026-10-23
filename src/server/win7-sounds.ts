import 'server-only';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { win7SoundFiles, type Win7Sound } from '@/src/lib/win7-sounds';

/** Only shipped files reach the browser; absent sounds cause no media requests. */
export function availableWin7Sounds(): Win7Sound[] {
  return (Object.keys(win7SoundFiles) as Win7Sound[]).filter(name =>
    existsSync(path.join(process.cwd(), 'public', 'assets', 'win7', 'sounds', win7SoundFiles[name])));
}
