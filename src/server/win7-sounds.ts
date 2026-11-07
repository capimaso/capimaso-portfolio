import 'server-only';
import { statSync } from 'node:fs';
import path from 'node:path';
import type { Win7Sound } from '@/src/lib/win7-sounds';
import { soundsMap } from '@/src/lib/sounds-map';

/** Only shipped files reach the browser; absent sounds cause no media requests. */
export function availableWin7Sounds(publicDirectory = path.join(process.cwd(), 'public')): Win7Sound[] {
  return (Object.keys(soundsMap) as Win7Sound[]).filter(name =>
    // The injectable root is used by tests; trace only shipped sounds via next.config.
    statSync(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ publicDirectory, soundsMap[name]), { throwIfNoEntry: false })?.isFile());
}
