import { z } from 'zod';
import { ADMIN_NOTE_MAX, ADMIN_NOTE_MIN } from '../constants';
import { DisputeDecisionSchema } from './dispute.schema';

/**
 * `POST /admin/disputes/{id}/resolve` body (`ResolveDisputeRequest`), also the resolve form.
 * receiverPercent must match the decision: REFUND_RECEIVER = 100, PAY_PROVIDER = 0, SPLIT = 1–99.
 * The backend computes the points from it; the UI only previews.
 */
export const ResolveDisputeRequestSchema = z
  .object({
    decision: DisputeDecisionSchema,
    receiverPercent: z.number().int().min(0).max(100),
    adminNote: z
      .string()
      .trim()
      .min(ADMIN_NOTE_MIN, `اكتب ${ADMIN_NOTE_MIN} أحرف على الأقل`)
      .max(ADMIN_NOTE_MAX, `الحد الأقصى ${ADMIN_NOTE_MAX} حرف`),
  })
  .superRefine(({ decision, receiverPercent }, ctx) => {
    const ok =
      decision === 'REFUND_RECEIVER'
        ? receiverPercent === 100
        : decision === 'PAY_PROVIDER'
          ? receiverPercent === 0
          : receiverPercent >= 1 && receiverPercent <= 99;
    if (!ok) {
      ctx.addIssue({
        code: 'custom',
        path: ['receiverPercent'],
        message: 'النسبة لا تطابق القرار',
      });
    }
  });
export type ResolveDisputeRequest = z.infer<typeof ResolveDisputeRequestSchema>;
