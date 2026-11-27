import type { NonIndexRouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';

/**
 * The /admin layout route. Its `children` are filled in src/app/router.tsx with the routes
 * of each admin-* feature (admin-dashboard, admin-categories, …).
 * Lazy: MUI and the admin shell load only when someone opens /admin.
 */
export const adminRoute: NonIndexRouteObject = {
  path: ROUTES.admin.root,
  lazy: async () => {
    const { AdminLayout } = await import('./components/AdminLayout');
    return { Component: AdminLayout };
  },
};
