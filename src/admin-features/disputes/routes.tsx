import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';

/** Admin disputes pages. Spread into the admin layout's children in `core/routes.tsx`. */
export const disputesRoutes: RouteObject[] = [
  {
    path: ROUTES.admin.disputes,
    handle: { crumb: 'النزاعات' },
    children: [
      {
        index: true,
        lazy: () => import('./pages/DisputesPage').then((m) => ({ Component: m.DisputesPage })),
      },
      {
        path: ROUTES.admin.dispute(':id'),
        handle: { crumb: 'تفاصيل النزاع' },
        lazy: () =>
          import('./pages/DisputeDetailPage').then((m) => ({ Component: m.DisputeDetailPage })),
      },
    ],
  },
];
