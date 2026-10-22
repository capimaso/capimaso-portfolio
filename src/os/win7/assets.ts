const icon = (group: string, file: string) => `/assets/win7/icons/${encodeURIComponent(group)}/${encodeURIComponent(file)}.ico`;

export const win7Assets = {
  photos: icon('Special Folders', 'imageres_113'),
  about: icon('Special Folders', 'imageres_123'),
  contact: icon('Shell32.dll', 'imageres_20'),
  games: icon('Special Folders', 'imageres_186'),
  recycle: icon('Shell32.dll', 'imageres_55'),
  network: icon('Shell32.dll', 'shell32_18'),
  volume: icon('Filetypes, Devices, Miscellaneous', 'audiosrv_203'),
  solitaire: icon('Games', 'Solitaire_108'),
  purble: icon('Games', 'PurblePlace_102'),
} as const;

export type Win7IconName = keyof typeof win7Assets;
