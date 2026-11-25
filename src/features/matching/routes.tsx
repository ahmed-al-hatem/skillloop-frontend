import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { MatchingPage } from './pages/MatchingPage';

export const matchingRoutes: RouteObject[] = [{ path: ROUTES.matching, element: <MatchingPage /> }];
