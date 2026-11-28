import { z } from 'zod';

/** Reason limits shared by `SuspendRequest` and `PointsAdjustmentRequest` (openapi.yaml). */
export const REASON_MIN = 5;
export const REASON_MAX = 300;

const reason = z
  .string()
  .trim()
  .min(REASON_MIN, `السبب ${REASON_MIN} أحرف على الأقل`)
  .max(REASON_MAX, `السبب ${REASON_MAX} حرف كحد أقصى`);

/** `SuspendRequest`: body of `POST /admin/users/{id}/suspend`. */
export const SuspendRequestSchema = z.object({ reason });
export type SuspendRequest = z.infer<typeof SuspendRequestSchema>;

/**
 * `PointsAdjustmentRequest`: body of `POST /admin/users/{id}/points-adjustment`.
 * Positive adds, negative removes, never 0. The backend refuses (422 `INSUFFICIENT_POINTS`)
 * when the available balance would go below 0.
 */
export const PointsAdjustmentRequestSchema = z.object({
  amount: z
    .number({ error: 'أدخل عدد النقاط' })
    .int('النقاط عدد صحيح')
    .refine((value) => value !== 0, 'لا يمكن أن يكون التعديل صفراً'),
  reason,
});
export type PointsAdjustmentRequest = z.infer<typeof PointsAdjustmentRequestSchema>;
