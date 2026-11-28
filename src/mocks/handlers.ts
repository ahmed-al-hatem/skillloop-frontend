import type { RequestHandler } from 'msw';
import { disputesAdminHandlers } from '@/admin-features/disputes/mocks/disputes.handlers';
import { overviewAdminHandlers } from '@/admin-features/overview/mocks/overview.handlers';
import { authHandlers } from '@/features/auth/mocks/auth.handlers';

/**
 * Each feature adds ONE import and ONE spread line below, kept alphabetical.
 * Handlers are imported from features/<f>/mocks/ directly (not via index.ts),
 * so mock data never ends up in the production bundle.
 */
export const handlers: RequestHandler[] = [
  ...authHandlers,
  ...disputesAdminHandlers,
  ...overviewAdminHandlers,
];
