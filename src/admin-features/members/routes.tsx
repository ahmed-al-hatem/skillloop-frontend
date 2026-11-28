import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';

/** Admin members pages. Spread into the admin layout's children in `core/routes.tsx`. */
export const membersRoutes: RouteObject[] = [
  {
    path: ROUTES.admin.members,
    handle: { crumb: 'الأعضاء' },
    lazy: () => import('./pages/MembersPage').then((m) => ({ Component: m.MembersPage })),
  },
];
