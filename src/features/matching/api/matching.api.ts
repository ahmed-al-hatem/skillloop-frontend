import { z } from 'zod';
import { api } from '@/shared/api/client';
import { MatchSchema, type Match } from '../schemas/match.schema';

/** GET /matches/suggestions — see docs/05-api-contract.md. */
export async function getSuggestions(): Promise<Match[]> {
  const res = await api.get('/matches/suggestions');
  return z.array(MatchSchema).parse(res.data.data);
}
