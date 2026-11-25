import type { RequestHandler } from 'msw';
import { matchingHandlers } from '@/features/matching/mocks/matching.handlers';

/**
 * Each feature adds ONE import and ONE spread line below.
 * Handlers are imported from features/<f>/mocks/ directly (not via index.ts),
 * so mock data never ends up in the production bundle.
 */
export const handlers: RequestHandler[] = [...matchingHandlers];
