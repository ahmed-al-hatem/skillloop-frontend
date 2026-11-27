import { createBrowserRouter } from 'react-router';
import { adminRoute } from '@/features/admin';
import { authRoutes } from '@/features/auth';
import { EmptyState } from '@/shared/components/EmptyState';
import { AuthLayout } from './layouts/AuthLayout';
import { MainLayout } from './layouts/MainLayout';

/**
 * Each feature adds ONE import and ONE spread line below — nothing else lives here.
 * Order inside `children` doesn't matter; keep it alphabetical to avoid merge conflicts.
 */
export const router = createBrowserRouter([
  {
    // Admin panel (MUI, lazy). Each admin-* feature adds ONE spread line inside `children`.
    ...adminRoute,
    children: [],
  },
  {
    element: <AuthLayout />,
    children: [...authRoutes],
  },
  {
    element: <MainLayout />,
    children: [
      // Placeholder until the home screen is built from the Figma designs.
      { index: true, element: <EmptyState title="SkillLoop" description="قريباً" /> },
      { path: '*', element: <EmptyState title="الصفحة غير موجودة" description="404" /> },
    ],
  },
]);
