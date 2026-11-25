import type { Match } from '../schemas/match.schema';

/** Fake data for MSW only — never import this from components. */
export const suggestions: Match[] = [
  {
    id: 'm1',
    partner: { id: 'u1', name: 'سارة خليل', avatarUrl: null, rating: 4.8 },
    theyOffer: [{ id: 's1', name: 'Photoshop', category: 'design' }],
    theyWant: [{ id: 's2', name: 'React', category: 'programming' }],
    score: 92,
  },
  {
    id: 'm2',
    partner: { id: 'u2', name: 'Omar Haddad', avatarUrl: null, rating: 4.5 },
    theyOffer: [{ id: 's3', name: 'English conversation', category: 'languages' }],
    theyWant: [{ id: 's4', name: 'التصوير', category: 'media' }],
    score: 85,
  },
  {
    id: 'm3',
    partner: { id: 'u3', name: 'لين منصور', avatarUrl: null, rating: null },
    theyOffer: [
      { id: 's5', name: 'Excel', category: 'business' },
      { id: 's6', name: 'المحاسبة', category: 'business' },
    ],
    theyWant: [{ id: 's7', name: 'Figma', category: 'design' }],
    score: 71,
  },
];
