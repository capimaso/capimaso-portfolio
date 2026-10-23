const icon = (group: string, file: string) => `/assets/win7/icons/${encodeURIComponent(group)}/${encodeURIComponent(file)}.ico`;

export const win7Assets = {
  controlPanel: icon('Control Panel', 'imageres_27'),
  personalization: icon('Filetypes, Devices, Miscellaneous', 'imageres_151'),
  sound: icon('Filetypes, Devices, Miscellaneous', 'audiosrv_203'),
  photos: icon('Special Folders', 'imageres_113'),
  folder: icon('Standard Folders', 'imageres_3'),
  calculator: icon('Standard Folders', 'imageres_3'), // Original Calculator icon not supplied; use the existing folder fallback.
  notepad: icon('Default Programs', 'notepad_2'),
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
