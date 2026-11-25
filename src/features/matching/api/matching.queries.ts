import { useQuery } from '@tanstack/react-query';
import { getSuggestions } from './matching.api';

/** All query keys of this feature live here (used for invalidation). */
export const matchingKeys = {
  all: ['matching'] as const,
  suggestions: () => [...matchingKeys.all, 'suggestions'] as const,
};

export function useSuggestions() {
  return useQuery({ queryKey: matchingKeys.suggestions(), queryFn: getSuggestions });
}
