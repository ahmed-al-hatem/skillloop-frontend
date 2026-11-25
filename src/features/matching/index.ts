// Public API of the matching feature. Other code imports ONLY from '@/features/matching'.
// Mocks are NOT exported here (they must stay out of the production bundle).
export { matchingRoutes } from './routes';
export { useSuggestions } from './api/matching.queries';
export type { Match } from './schemas/match.schema';
