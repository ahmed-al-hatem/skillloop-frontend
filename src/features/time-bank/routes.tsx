import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { TimeBankPage } from './pages/TimeBankPage';

export const timeBankRoutes: RouteObject[] = [{ path: ROUTES.timeBank, element: <TimeBankPage /> }];
