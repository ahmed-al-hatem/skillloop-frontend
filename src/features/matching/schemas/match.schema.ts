import { z } from 'zod';
import { SkillSchema, UserSummarySchema } from '@/shared/schemas';

/** A suggested partner: what they can teach me and what they want to learn from me. */
export const MatchSchema = z.object({
  id: z.string(),
  partner: UserSummarySchema,
  /** Skills the partner offers that I want to learn. */
  theyOffer: z.array(SkillSchema),
  /** Skills I offer that the partner wants to learn. */
  theyWant: z.array(SkillSchema),
  /** 0–100, computed by the backend. */
  score: z.number().min(0).max(100),
});
export type Match = z.infer<typeof MatchSchema>;
