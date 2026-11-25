import { createBrowserRouter, Navigate } from 'react-router';
import { authRoutes } from '@/features/auth';
import { exchangesRoutes } from '@/features/exchanges';
import { matchingRoutes } from '@/features/matching';
import { profileRoutes } from '@/features/profile';
import { reviewsRoutes } from '@/features/reviews';
import { timeBankRoutes } from '@/features/time-bank';
import { EmptyState } from '@/shared/components/EmptyState';
import { ROUTES } from '@/shared/constants/routes';
import { AuthLayout } from './layouts/AuthLayout';
import { MainLayout } from './layouts/MainLayout';

/**
 * Each feature adds ONE import and ONE spread line below — nothing else lives here.
 * Order inside `children` doesn't matter; keep it alphabetical to avoid merge conflicts.
 */
export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [...authRoutes],
  },
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to={ROUTES.matching} replace /> },
      ...exchangesRoutes,
      ...matchingRoutes,
      ...profileRoutes,
      ...reviewsRoutes,
      ...timeBankRoutes,
      { path: '*', element: <EmptyState title="الصفحة غير موجودة" description="404" /> },
    ],
  },
]);
