import { z } from 'zod';

export type ConfirmReasonOptions = {
  /** Field label, e.g. "سبب الأرشفة". A red `*` is added after it. */
  label: string;
  /** Muted text after the label, e.g. "(يُرسل لمقدم الخدمة)". */
  note?: string;
  placeholder?: string;
  /** Minimum length after trimming. Defaults to 5. */
  min?: number;
  /** Maximum length. Defaults to 300; typing stops there. */
  max?: number;
};

export type ConfirmFormValues = {
  reason: string;
  confirmWord: string;
  acknowledged: boolean;
};

type SchemaOptions = {
  reason?: Pick<ConfirmReasonOptions, 'min' | 'max'>;
  confirmWord?: string;
  acknowledge: boolean;
};

export const DEFAULT_REASON_MIN = 5;
export const DEFAULT_REASON_MAX = 300;

/** Builds the form schema from the dialog props: only the fields that are shown are checked. */
export function buildConfirmSchema({ reason, confirmWord, acknowledge }: SchemaOptions) {
  const min = reason?.min ?? DEFAULT_REASON_MIN;
  const max = reason?.max ?? DEFAULT_REASON_MAX;

  return z.object({
    reason: reason
      ? z
          .string()
          .trim()
          .min(1, 'السبب مطلوب')
          .min(min, `السبب قصير جداً، اكتب ${min} أحرف على الأقل`)
          .max(max, `السبب طويل جداً، الحد ${max} حرف`)
      : z.string(),
    confirmWord: confirmWord
      ? z.string().refine((value) => value.trim() === confirmWord, 'الكلمة غير مطابقة')
      : z.string(),
    acknowledged: acknowledge ? z.boolean().refine(Boolean, 'الإقرار مطلوب') : z.boolean(),
  });
}
