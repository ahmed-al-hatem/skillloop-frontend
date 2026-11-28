import { z } from 'zod';
import {
  AdminUserDetailsSchema,
  type AdminUserDetails,
  type WalletTransaction,
} from '../schemas/member.schema';

/** Fake members for MSW. Parsed with the schema below so fixtures never drift from the contract. */

const uuid = (prefix: string, n: number) =>
  `${prefix}-0000-4000-8000-${String(n).padStart(12, '0')}`;

const day = (daysAgo: number) => new Date(Date.UTC(2026, 10, 28 - daysAgo, 9)).toISOString();

type Seed = [fullName: string, email: string, city: string | null, points: number, rating: number];

const seeds: Seed[] = [
  ['Samer Haddad', 'member@skillloop.test', 'Amman', 35, 4.9],
  ['رنا الخطيب', 'rana@example.com', 'Irbid', 120, 4.7],
  ['محمد العلي', 'mohammad@example.com', 'Zarqa', 0, 3.8],
  ['Lina Saleh', 'lina@example.com', 'Amman', 640, 5],
  ['أحمد يوسف', 'ahmad.y@example.com', null, 15, 0],
  ['Omar Nasser', 'omar@example.com', 'Aqaba', 90, 4.2],
  ['هبة قاسم', 'heba@example.com', 'Amman', 210, 4.5],
  ['يزن حداد', 'yazan@example.com', 'Salt', 5, 2.9],
  ['Noor Fares', 'noor@example.com', 'Madaba', 60, 4.8],
  ['سارة منصور', 'sara.m@example.com', 'Amman', 1200, 4.95],
  ['خالد الزعبي', 'khaled@example.com', 'Irbid', 40, 4.1],
  ['Dana Khoury', 'dana@example.com', 'Amman', 75, 0],
  ['ماجد عودة', 'majed@example.com', 'Jerash', 0, 3.5],
  ['Tala Haddad', 'tala@example.com', 'Amman', 300, 4.6],
  ['عمر الشريف', 'omar.sh@example.com', 'Karak', 25, 4],
  ['Reem Odeh', 'reem@example.com', null, 180, 4.3],
  ['ليث عبيدات', 'laith@example.com', 'Irbid', 10, 3.2],
  ['Hala Barakat', 'hala@example.com', 'Amman', 95, 4.75],
  ['فرح النجار', 'farah@example.com', 'Zarqa', 55, 4.4],
  ['Kareem Aziz', 'kareem@example.com', 'Aqaba', 130, 4.9],
  ['ديما سليمان', 'dima@example.com', 'Amman', 20, 0],
  ['Fadi Rashed', 'fadi@example.com', 'Salt', 400, 4.85],
];

/** Members with these indexes start SUSPENDED, so the status filter has something to show. */
const SUSPENDED = new Set([2, 7, 12]);

function transactions(n: number, points: number): WalletTransaction[] {
  return [
    {
      id: uuid('7a000000', n * 10 + 1),
      type: 'WELCOME_BONUS',
      availableChange: 20,
      heldChange: 0,
      availableAfter: 20,
      heldAfter: 0,
      bookingId: null,
      note: null,
      createdAt: day(60 + n),
    },
    {
      id: uuid('7a000000', n * 10 + 2),
      type: 'ADMIN_ADJUSTMENT',
      availableChange: points - 20,
      heldChange: 0,
      availableAfter: points,
      heldAfter: 0,
      bookingId: null,
      note: 'رصيد افتتاحي للبيانات التجريبية',
      createdAt: day(30 + n),
    },
  ];
}

function member([fullName, email, city, points, rating]: Seed, n: number): AdminUserDetails {
  const suspended = SUSPENDED.has(n);
  return {
    // Index 0 keeps the auth mock member's id, so logging in as them matches this record.
    id: n === 0 ? '3f6c2a9e-8b1d-4c7a-9e2f-1a2b3c4d5e6f' : uuid('5e000000', n),
    fullName,
    email,
    phone: n % 4 === 3 ? null : `+96279${String(1000000 + n * 37_123).slice(0, 7)}`,
    role: 'USER',
    status: suspended ? 'SUSPENDED' : 'ACTIVE',
    emailVerified: n % 5 !== 4,
    pointsAvailable: points,
    pointsHeld: n % 3 === 0 ? 25 : 0,
    ratingAvg: rating,
    ratingCount: rating === 0 ? 0 : 3 + n,
    createdAt: day(60 + n),
    lastLoginAt: n % 6 === 5 ? null : day(n % 7),
    photoUrl: null,
    bio: n % 2 === 0 ? 'أحب تبادل المهارات وتعلّم أشياء جديدة.' : null,
    city,
    suspendedReason: suspended ? 'تغيّب متكرر عن المواعيد حسب النزاعات المبلّغ عنها.' : null,
    suspendedAt: suspended ? day(3) : null,
    completedBookingsCount: (n * 3) % 17,
    activeServicesCount: n % 4,
    bookingsAsReceiverCount: (n * 2) % 9,
    bookingsAsProviderCount: (n * 5) % 15,
    recentTransactions: transactions(n, points).reverse(),
  };
}

export const memberFixtures: AdminUserDetails[] = z
  .array(AdminUserDetailsSchema)
  .parse(seeds.map(member));
