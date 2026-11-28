import type { RouteObject } from 'react-router';

/** `/admin` index. Spread into the admin layout's children in `core/routes.tsx`. */
export const overviewRoutes: RouteObject[] = [
  {
    index: true,
    handle: { crumb: 'الرئيسية' },
    lazy: () => import('./pages/OverviewPage').then((m) => ({ Component: m.OverviewPage })),
  },
];
