export type Comment = {
  id: string;
  /** Name shown on the comment. */
  name: string;
  /** Photo: just the file name of an image you put in public/images/avatars/ (e.g. 'joao.jpg').
   *  A full URL or a path starting with "/" also works. Leave empty for the default silhouette. */
  avatar?: string;
  /** The comment text. */
  comment: string;
  /** Where the name leads when clicked: the person's YouTube / Instagram / X / TikTok profile, etc.
   *  Leave empty and the name is not clickable. */
  link?: string;
  /** Optional free text shown next to the name, e.g. '12/03/2026' or 'há 2 dias'. */
  date?: string;
};

// 🔧 EDIT THE COMMENTS (GUESTBOOK) OF "MY PORTFOLIO" HERE.
// 1. Put the person's photo in:  public/images/avatars/
// 2. Copy one block below, change name / avatar / comment / link.
// 3. Newest comments first = put them at the top of the list.
export const comments: Comment[] = [
  // {
  //   id: 'example-1',
  //   name: 'Real Person Name',
  //   avatar: 'real-person.jpg',               // → public/images/avatars/real-person.jpg
  //   comment: 'Write what this person said about your work here.',
  //   link: 'https://youtube.com/@their-channel',
  //   date: '05/10/2026'
  // },
  {
    id: 'Megluuh',
    name: 'MegLuuh',
    avatar: 'megluuh.jpg',     
    comment: 'Adorei, ficou bem dinâmico, manteve o ritmo da live',
    link: 'https://www.youtube.com/@megluuh',
    date: '01/09/2026'
  },
];
