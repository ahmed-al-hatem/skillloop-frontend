import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { ProfilePage } from './pages/ProfilePage';

export const profileRoutes: RouteObject[] = [{ path: ROUTES.profile, element: <ProfilePage /> }];
