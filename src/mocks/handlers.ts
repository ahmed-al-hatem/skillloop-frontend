import type { RequestHandler } from 'msw';
import { adminDashboardHandlers } from '@/features/admin-dashboard/mocks/adminDashboard.handlers';

/**
 * Each feature adds ONE import and ONE spread line below, e.g.
 *   import { authHandlers } from '@/features/auth/mocks/auth.handlers';
 *   export const handlers: RequestHandler[] = [...authHandlers];
 * Handlers are imported from features/<f>/mocks/ directly (not via index.ts),
 * so mock data never ends up in the production bundle.
 */
export const handlers: RequestHandler[] = [...adminDashboardHandlers];
