import type { Me } from '../schemas/auth.schema';

/** Mock accounts. Log in with these in dev (`VITE_USE_MOCKS=true`). Test values only. */
export type MockAccount = { password: string; suspended?: boolean; user: Me };

const baseUser = {
  phone: '+962791234567',
  photoUrl: null,
  bio: null,
  city: 'Amman',
  language: 'ar',
  emailVerified: true,
  needsPhone: false,
  hasPassword: true,
  pointsHeld: 0,
  memberSince: '2026-11-01T09:00:00Z',
} as const;

export const mockAccounts: MockAccount[] = [
  {
    password: 'Admin123',
    user: {
      ...baseUser,
      id: '0b8e4a52-3c1d-4f6a-9e7b-2d5c8a1f4e30',
      fullName: 'ليلى منصور',
      email: 'admin@skillloop.test',
      role: 'ADMIN',
      pointsAvailable: 0,
      ratingAvg: 0,
      ratingCount: 0,
      completedBookingsCount: 0,
    },
  },
  {
    password: 'Member123',
    user: {
      ...baseUser,
      id: '3f6c2a9e-8b1d-4c7a-9e2f-1a2b3c4d5e6f',
      fullName: 'Samer Haddad',
      email: 'member@skillloop.test',
      role: 'USER',
      bio: 'Graphic designer, 5 years of logo and brand work.',
      pointsAvailable: 60,
      ratingAvg: 4.9,
      ratingCount: 12,
      completedBookingsCount: 12,
    },
  },
  {
    password: 'Member123',
    suspended: true,
    user: {
      ...baseUser,
      id: '9a1d7c3e-5b2f-4e8a-8c6d-4f3e2a1b0c9d',
      fullName: 'ريم خليل',
      email: 'suspended@skillloop.test',
      role: 'USER',
      pointsAvailable: 10,
      ratingAvg: 4.2,
      ratingCount: 3,
      completedBookingsCount: 3,
    },
  },
];
