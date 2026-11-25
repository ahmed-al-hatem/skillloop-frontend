import { z } from 'zod';

export const SkillLevelSchema = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);
export type SkillLevel = z.infer<typeof SkillLevelSchema>;

/** A skill from the catalog (e.g. "Photoshop", "English conversation"). */
export const SkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
});
export type Skill = z.infer<typeof SkillSchema>;
