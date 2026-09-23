export type Service = {
  id: string;
  name: string;
  price: string;
  description: string;
};

export const services: Service[] = [
  { id: 'short-form', name: 'SHORT FORM', price: 'FROM R$ XX', description: 'Short-form edits for social platforms.' },
  { id: 'long-form', name: 'LONG FORM', price: 'FROM R$ XX', description: 'Long-form editing for videos and episodes.' },
  { id: 'gameplay', name: 'GAMEPLAY', price: 'CUSTOM QUOTE', description: 'Gaming edits, highlights and focused cuts.' },
  { id: 'creator-content', name: 'CREATOR CONTENT', price: 'CUSTOM QUOTE', description: 'Editing support for creator-led content.' },
  { id: 'custom', name: 'CUSTOM PROJECTS', price: 'CUSTOM QUOTE', description: 'For projects that need a tailored workflow.' }
];

export type Package = {
  name: string;
  quantity: string;
  price: string;
  turnaround: string;
  revisions: string;
  benefits: string;
};

export const packages: Package[] = [
  { name: '1 VIDEO', quantity: '1', price: 'R$ XX', turnaround: 'SET DEADLINE', revisions: 'SET REVISIONS', benefits: 'SET BENEFITS' },
  { name: '5 VIDEOS', quantity: '5', price: 'R$ XX', turnaround: 'SET DEADLINE', revisions: 'SET REVISIONS', benefits: 'SET BENEFITS' },
  { name: '10 VIDEOS', quantity: '10', price: 'R$ XX', turnaround: 'SET DEADLINE', revisions: 'SET REVISIONS', benefits: 'SET BENEFITS' },
  { name: 'CUSTOM', quantity: '—', price: 'CUSTOM QUOTE', turnaround: 'CUSTOM', revisions: 'CUSTOM', benefits: 'CUSTOM' }
];
