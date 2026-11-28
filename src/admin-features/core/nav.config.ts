import { ROUTES } from '@/shared/constants/routes';

/** Sidebar groups, in display order (design: Sidebar artboard). `label: null` = no group title. */
export const adminNavGroups = [
  { key: 'home', label: null },
  { key: 'operations', label: 'العمليات' },
  { key: 'catalog', label: 'الكتالوج' },
  { key: 'system', label: 'النظام' },
] as const;

export type AdminNavGroup = (typeof adminNavGroups)[number]['key'];

/** Which release a nav entry belongs to. Only `v1` entries are listed until P2 has contract support. */
export type AdminNavPhase = 'v1' | 'P2' | 'later';

/** Icon names; the sidebar maps each one to its inline SVG from the design. */
export type AdminNavIcon =
  | 'home'
  | 'disputes'
  | 'members'
  | 'bookings'
  | 'services'
  | 'categories'
  | 'suggestions'
  | 'settings';

/** Counters shown as a pill next to the label (from `GET /admin/dashboard`). */
export type AdminNavBadge = 'openDisputes' | 'pendingSuggestions';

export type AdminNavItem = {
  key: string;
  label: string;
  to: string;
  icon: AdminNavIcon;
  group: AdminNavGroup;
  phase: AdminNavPhase;
  badge?: AdminNavBadge;
};

/** Adding a screen to the sidebar = one entry here, in display order. */
export const adminNav: readonly AdminNavItem[] = [
  {
    key: 'home',
    label: 'الرئيسية',
    to: ROUTES.admin.root,
    icon: 'home',
    group: 'home',
    phase: 'v1',
  },
  {
    key: 'disputes',
    label: 'النزاعات',
    to: ROUTES.admin.disputes,
    icon: 'disputes',
    group: 'operations',
    phase: 'v1',
    badge: 'openDisputes',
  },
  {
    key: 'members',
    label: 'الأعضاء',
    to: ROUTES.admin.members,
    icon: 'members',
    group: 'operations',
    phase: 'v1',
  },
  {
    key: 'bookings',
    label: 'الحجوزات',
    to: ROUTES.admin.bookings,
    icon: 'bookings',
    group: 'operations',
    phase: 'v1',
  },
  {
    key: 'services',
    label: 'الخدمات',
    to: ROUTES.admin.services,
    icon: 'services',
    group: 'operations',
    phase: 'v1',
  },
  {
    key: 'categories',
    label: 'التصنيفات',
    to: ROUTES.admin.categories,
    icon: 'categories',
    group: 'catalog',
    phase: 'v1',
  },
  {
    key: 'categorySuggestions',
    label: 'اقتراحات التصنيفات',
    to: ROUTES.admin.categorySuggestions,
    icon: 'suggestions',
    group: 'catalog',
    phase: 'v1',
    badge: 'pendingSuggestions',
  },
  {
    key: 'settings',
    label: 'الإعدادات',
    to: ROUTES.admin.settings,
    icon: 'settings',
    group: 'system',
    phase: 'v1',
  },
];
