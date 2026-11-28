import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';

/** Admin members pages. Spread into the admin layout's children in `core/routes.tsx`. */
export const membersRoutes: RouteObject[] = [
  {
    path: ROUTES.admin.members,
    handle: { crumb: 'الأعضاء' },
    children: [
      {
        index: true,
        lazy: () => import('./pages/MembersPage').then((m) => ({ Component: m.MembersPage })),
      },
      {
        path: ROUTES.admin.member(':id'),
        handle: { crumb: 'تفاصيل العضو' },
        lazy: () =>
          import('./pages/MemberDetailPage').then((m) => ({ Component: m.MemberDetailPage })),
      },
    ],
  },
];
