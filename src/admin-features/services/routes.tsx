import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';

/** Admin services pages. Spread into the admin layout's children in `core/routes.tsx`. */
export const servicesRoutes: RouteObject[] = [
  {
    path: ROUTES.admin.services,
    handle: { crumb: 'الخدمات' },
    lazy: () => import('./pages/ServicesPage').then((m) => ({ Component: m.ServicesPage })),
  },
];
