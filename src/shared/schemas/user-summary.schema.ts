import { z } from 'zod';

/** The small user object embedded in other resources (match, exchange, review...). */
export const UserSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.url().nullable(),
  rating: z.number().min(0).max(5).nullable(),
});
export type UserSummary = z.infer<typeof UserSummarySchema>;
