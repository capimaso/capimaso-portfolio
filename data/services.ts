export type Service = {
  id: string;
  name: string;
  price: string;
  description: string;
};

export const services: Service[] = [
  { id: 'short-form', name: 'SHORT FORM', price: 'FROM R$40,00', description: 'Reels, Shorts and TikTok edits up to 60 seconds.' },
  { id: 'long-form', name: 'LONG FORM', price: 'FROM R$90,00', description: 'Long-form videos with pricing adjusted to duration and complexity.' },
  { id: 'gameplay', name: 'GAMEPLAY', price: 'CUSTOM QUOTE', description: 'Dynamic gaming edits, highlights and creator-focused cuts.' },
  { id: 'creator-content', name: 'CREATOR CONTENT', price: 'CUSTOM QUOTE', description: 'Editing support for gaming creators and digital content.' },
  { id: 'custom', name: 'CUSTOM PROJECTS', price: 'CUSTOM QUOTE', description: 'A tailored quote for projects outside the standard formats.' }
];

export type Package = {
  name: string;
  quantity: string;
  price: string;
  unitPrice?: string;
  turnaround: string;
  revisions: string;
  benefits: string;
};

// SHORT FORM: values supplied by CAPIMASO.
export const shortPackages: Package[] = [
  { name: '01 VIDEO', quantity: '1', price: 'R$40,00', unitPrice: 'R$ 40/un.', turnaround: '2 days', revisions: 'To be arranged', benefits: 'Video up to 60 seconds long' },
  { name: '02 VIDEOS', quantity: '2', price: 'R$75,00', unitPrice: 'R$ 37,50/un.', turnaround: 'To be arranged', revisions: 'To be arranged', benefits: 'Video up to 60 seconds long' },
  { name: '03 VIDEOS', quantity: '3', price: 'R$105,00', unitPrice: 'R$ 35/un.', turnaround: 'To be arranged', revisions: 'To be arranged', benefits: 'Video up to 60 seconds long' },
  { name: '04 VIDEOS', quantity: '4', price: 'R$130,00', unitPrice: 'R$ 32,50/un.', turnaround: 'To be arranged', revisions: 'To be arranged', benefits: 'VVideo up to 60 seconds long' },
  { name: '05 VIDEOS', quantity: '5', price: 'R$160,00', unitPrice: 'R$ 32/un.', turnaround: 'To be arranged', revisions: 'To be arranged', benefits: 'Video up to 60 seconds long' },
  { name: '06 VIDEOS', quantity: '6', price: 'R$185,00', unitPrice: 'R$ 30,83/un.', turnaround: 'To be arranged', revisions: 'To be arranged', benefits: 'Video up to 60 seconds long' },
  { name: '07 VIDEOS', quantity: '7', price: 'R$210,00', unitPrice: 'R$ 30/un.', turnaround: 'To be arranged', revisions: 'To be arranged', benefits: 'Video up to 60 seconds long' },
  { name: '08 VIDEOS', quantity: '8', price: 'R$235,00', unitPrice: 'R$ 29,38/un.', turnaround: 'To be arranged', revisions: 'To be arranged', benefits: 'Video up to 60 seconds long' },
  { name: '09 VIDEOS', quantity: '9', price: 'R$265,00', unitPrice: 'R$ 29,44/un.', turnaround: 'To be arranged', revisions: 'To be arranged', benefits: 'Video up to 60 seconds long' },
  { name: '10 VIDEOS', quantity: '10', price: 'R$290,00', unitPrice: 'R$ 29/un.', turnaround: 'To be arranged', revisions: 'To be arranged', benefits: 'Video up to 60 seconds long' }
];

// LONG FORM: suggested starting point based on the current short-form price level.
export const longFormPricing = {
  startingPrice: 'FROM R$90,00',
  note: 'Suggested starting point. Adjust according to final duration, raw footage, complexity and revisions.'
};
