import { z } from 'zod';
import { ADMIN_NOTE_MAX, ADMIN_NOTE_MIN } from '../constants';
import { DisputeDecisionSchema, type DisputeDecision } from './dispute.schema';

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

/**
 * What the admin fills in. `splitPercent` is the slider (receiver's share) and is only sent
 * for SPLIT; `toResolveRequest` maps the decision to the contract's `receiverPercent`.
 */
export const ResolveFormSchema = z.object({
  decision: z.enum(DisputeDecisionSchema.options, { error: 'اختر القرار' }),
  splitPercent: z.number().int().min(1).max(99),
  adminNote: ResolveDisputeRequestSchema.shape.adminNote,
});
export type ResolveFormValues = z.infer<typeof ResolveFormSchema>;
/** Before validation: `decision` may still be empty. */
export type ResolveFormInput = z.input<typeof ResolveFormSchema>;

const FIXED_PERCENT = { REFUND_RECEIVER: 100, PAY_PROVIDER: 0 } as const;

/** Receiver's share for a decision: fixed by the contract, or the slider for SPLIT. */
export function receiverPercentOf(decision: DisputeDecision, splitPercent: number): number {
  return decision === 'SPLIT' ? splitPercent : FIXED_PERCENT[decision];
}

export function toResolveRequest(values: ResolveFormValues): ResolveDisputeRequest {
  return {
    decision: values.decision,
    receiverPercent: receiverPercentOf(values.decision, values.splitPercent),
    adminNote: values.adminNote.trim(),
  };
}
