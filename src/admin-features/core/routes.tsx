import type { RouteObject } from 'react-router';
import { bookingsRoutes } from '@/admin-features/bookings';
import { disputesRoutes } from '@/admin-features/disputes';
import { membersRoutes } from '@/admin-features/members';
import { overviewRoutes } from '@/admin-features/overview';
import { servicesRoutes } from '@/admin-features/services';
import { ROUTES } from '@/shared/constants/routes';

/** Route `handle` read by the admin topbar (breadcrumb) and `document.title`. */
export type AdminRouteHandle = { crumb: string };

/**
 * The whole admin area. `src/app/router.tsx` spreads this once.
 * Every page is lazy so the member bundle never ships admin code.
 * Admin feature routes are added inside `children`, alphabetical, one spread each.
 * `RequireAdmin` guards every child; `AdminLayout` (sidebar + topbar) wraps every page.
 * The session-expired page is outside the guard (it is where the guard sends you).
 */
export const adminRoutes: RouteObject[] = [
  {
    path: ROUTES.admin.sessionExpired,
    lazy: () =>
      import('./pages/SessionExpiredPage').then((m) => ({ Component: m.SessionExpiredPage })),
  },
  {
    path: ROUTES.admin.root,
    lazy: () => import('./components/RequireAdmin').then((m) => ({ Component: m.RequireAdmin })),
    handle: { crumb: 'لوحة الإدارة' } satisfies AdminRouteHandle,
    children: [
      {
        lazy: () => import('./components/AdminLayout').then((m) => ({ Component: m.AdminLayout })),
        children: [
          ...bookingsRoutes,
          ...disputesRoutes,
          ...membersRoutes,
          ...overviewRoutes,
          ...servicesRoutes,
          {
            path: '*',
            handle: { crumb: 'الصفحة غير موجودة' } satisfies AdminRouteHandle,
            lazy: () =>
              import('./pages/AdminNotFound').then((m) => ({ Component: m.AdminNotFound })),
          },
        ],
      },
    ],
  },
];
