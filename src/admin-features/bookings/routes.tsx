import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';

/** Admin bookings pages. Spread into the admin layout's children in `core/routes.tsx`. */
export const bookingsRoutes: RouteObject[] = [
  {
    path: ROUTES.admin.bookings,
    handle: { crumb: 'الحجوزات' },
    lazy: () => import('./pages/BookingsPage').then((m) => ({ Component: m.BookingsPage })),
  },
];
