import type { RouteObject } from 'react-router';
import { ROUTES } from '@/shared/constants/routes';
import { ReviewsPage } from './pages/ReviewsPage';

export const reviewsRoutes: RouteObject[] = [{ path: ROUTES.reviews, element: <ReviewsPage /> }];
