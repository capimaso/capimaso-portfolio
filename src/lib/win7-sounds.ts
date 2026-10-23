export const win7SoundFiles = {
  logon: 'logon.wav', navigation: 'navigation.wav', minimize: 'minimize.wav', error: 'error.wav', startup: 'startup.wav',
} as const;
export type Win7Sound = keyof typeof win7SoundFiles;
