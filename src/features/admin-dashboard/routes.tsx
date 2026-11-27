import type { RouteObject } from 'react-router';

/** Nested under `adminRoute` (/admin). Lazy, so MUI charts load only on this page. */
export const adminDashboardRoutes: RouteObject[] = [
  {
    index: true,
    lazy: async () => {
      const { AdminDashboardPage } = await import('./pages/AdminDashboardPage');
      return { Component: AdminDashboardPage };
    },
  },
];
