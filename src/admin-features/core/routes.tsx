import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';

/** Route `handle` read by the admin topbar (breadcrumb) and `document.title`. */
export type AdminRouteHandle = { crumb: string };

/**
 * The whole admin area. `src/app/router.tsx` spreads this once.
 * Every page is lazy so the member bundle never ships admin code.
 * Admin feature routes are added inside `children`, alphabetical, one spread each.
 * `RequireAdmin` guards every child; AdminLayout goes inside it when the shell lands.
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
        index: true,
        handle: { crumb: 'الرئيسية' } satisfies AdminRouteHandle,
        lazy: () =>
          import('./pages/AdminHomePlaceholder').then((m) => ({
            Component: m.AdminHomePlaceholder,
          })),
      },
      {
        path: '*',
        handle: { crumb: 'الصفحة غير موجودة' } satisfies AdminRouteHandle,
        lazy: () => import('./pages/AdminNotFound').then((m) => ({ Component: m.AdminNotFound })),
      },
    ],
  },
];
