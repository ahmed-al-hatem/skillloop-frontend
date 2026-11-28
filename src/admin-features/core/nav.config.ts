import { ROUTES } from '@/shared/constants/routes';

/**
 * Sidebar groups, in display order (design: Sidebar artboard). `label: null` = no group title.
 * A group with a `phase` shows that tag next to its title and lists its items compact.
 */
export const adminNavGroups = [
  { key: 'home', label: null },
  { key: 'operations', label: 'العمليات' },
  { key: 'catalog', label: 'الكتالوج' },
  { key: 'analytics', label: 'التحليلات', phase: 'P2' },
  { key: 'system', label: 'النظام' },
] as const;

export type AdminNavGroup = (typeof adminNavGroups)[number]['key'];

/** Which release a nav entry belongs to. `P2` and `later` entries are shown as disabled placeholders. */
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
  | 'settings'
  | 'purchases'
  | 'reviews'
  | 'packages'
  | 'analytics'
  | 'auditLog'
  | 'announcements';

/** Counters shown as a pill next to the label (from `GET /admin/dashboard`). */
export type AdminNavBadge = 'openDisputes' | 'pendingSuggestions';

type AdminNavItemBase = {
  key: string;
  label: string;
  /** Without an icon the label is indented to line up with the labels above it. */
  icon?: AdminNavIcon;
  group: AdminNavGroup;
  badge?: AdminNavBadge;
};

/** A `v1` entry is a link; a `P2`/`later` entry has no screen yet, so it has no `to`. */
export type AdminNavItem = AdminNavItemBase &
  ({ phase: 'v1'; to: string } | { phase: Exclude<AdminNavPhase, 'v1'>; to?: never });

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
  { key: 'purchases', label: 'المشتريات', icon: 'purchases', group: 'operations', phase: 'P2' },
  { key: 'reviews', label: 'التقييمات', icon: 'reviews', group: 'operations', phase: 'P2' },
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
  { key: 'packages', label: 'الباقات', icon: 'packages', group: 'catalog', phase: 'P2' },
  { key: 'growth', label: 'النمو', icon: 'analytics', group: 'analytics', phase: 'P2' },
  { key: 'market', label: 'السوق', group: 'analytics', phase: 'P2' },
  { key: 'economy', label: 'اقتصاد النقاط', group: 'analytics', phase: 'P2' },
  { key: 'quality', label: 'الجودة والثقة', group: 'analytics', phase: 'P2' },
  { key: 'categoryInsights', label: 'تفاصيل التصنيف', group: 'analytics', phase: 'P2' },
  {
    key: 'settings',
    label: 'الإعدادات',
    to: ROUTES.admin.settings,
    icon: 'settings',
    group: 'system',
    phase: 'v1',
  },
  { key: 'auditLog', label: 'سجل الإجراءات', icon: 'auditLog', group: 'system', phase: 'P2' },
  {
    key: 'announcements',
    label: 'الإعلانات',
    icon: 'announcements',
    group: 'system',
    phase: 'later',
  },
];
