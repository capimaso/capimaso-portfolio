const icon = (group: string, file: string) => `/assets/win7/icons/${encodeURIComponent(group)}/${encodeURIComponent(file)}.ico`;

export const win7Assets = {
  photos: icon('Special Folders', 'imageres_113'),
  folder: icon('Standard Folders', 'imageres_3'),
  photoViewer: icon('Libraries', 'imageres_1003'),
  about: icon('Special Folders', 'imageres_123'),
  contact: icon('Shell32.dll', 'imageres_20'),
  games: icon('Special Folders', 'imageres_186'),
  recycle: icon('Shell32.dll', 'imageres_55'),
  network: icon('Shell32.dll', 'shell32_18'),
  notifications: icon('Action Center', 'ActionCenter_5'),
  solitaire: icon('Games', 'Solitaire_108'),
  purble: icon('Games', 'PurblePlace_102'),
} as const;

export type Win7IconName = keyof typeof win7Assets;
