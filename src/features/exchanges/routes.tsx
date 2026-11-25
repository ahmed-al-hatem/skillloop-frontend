import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { ExchangesPage } from './pages/ExchangesPage';

export const exchangesRoutes: RouteObject[] = [
  { path: ROUTES.exchanges, element: <ExchangesPage /> },
];
