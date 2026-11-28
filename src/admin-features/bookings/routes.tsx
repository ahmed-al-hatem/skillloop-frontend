import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';

/**
 * Admin bookings pages. Spread into the admin layout's children in `core/routes.tsx`.
 * The detail is a drawer nested in the list route, so the list stays behind it.
 */
export const bookingsRoutes: RouteObject[] = [
  {
    path: ROUTES.admin.bookings,
    handle: { crumb: 'الحجوزات' },
    lazy: () => import('./pages/BookingsPage').then((m) => ({ Component: m.BookingsPage })),
    children: [
      {
        path: ROUTES.admin.booking(':id'),
        handle: { crumb: 'تفاصيل الحجز' },
        lazy: () =>
          import('./components/BookingDetailDrawer').then((m) => ({
            Component: m.BookingDetailDrawer,
          })),
      },
    ],
  },
];
