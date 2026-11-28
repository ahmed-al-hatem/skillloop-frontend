import type { StatusBadgeVariant } from '@/shared/components/ui/StatusBadge';
import type { ResponseState } from './lib/responseState';
import type { DisputeDecision, DisputeReason, DisputeStatus } from './schemas/dispute.schema';

/** `adminNote` limits from `ResolveDisputeRequest` in openapi.yaml. */
export const ADMIN_NOTE_MIN = 10;
export const ADMIN_NOTE_MAX = 1000;

export const DISPUTE_STATUS_LABELS = {
  OPEN: 'مفتوح',
  RESOLVED: 'تمّ الحل',
} as const satisfies Record<DisputeStatus, string>;

export const DISPUTE_STATUS_VARIANTS = {
  OPEN: 'warning',
  RESOLVED: 'success',
} as const satisfies Record<DisputeStatus, StatusBadgeVariant>;

export const DISPUTE_REASON_LABELS = {
  PROVIDER_NO_SHOW: 'لم يحضر مقدّم الخدمة',
  NOT_DELIVERED: 'لم يتم التسليم',
  POOR_QUALITY: 'جودة ضعيفة',
  NOT_AS_DESCRIBED: 'غير مطابق للوصف',
  OTHER: 'سبب آخر',
} as const satisfies Record<DisputeReason, string>;

export const DISPUTE_DECISION_LABELS = {
  REFUND_RECEIVER: 'إرجاع النقاط للمستفيد',
  PAY_PROVIDER: 'تحويل النقاط لمقدّم الخدمة',
  SPLIT: 'تقسيم النقاط',
} as const satisfies Record<DisputeDecision, string>;

/** Provider reply column of the open-disputes table. */
export const RESPONSE_STATE_LABELS = {
  responded: 'تم الرد',
  overdue: 'لم يرد · انتهت المهلة',
  waiting: 'بانتظار الرد',
} as const satisfies Record<ResponseState, string>;

export const RESPONSE_STATE_VARIANTS = {
  responded: 'success',
  overdue: 'danger',
  waiting: 'warning',
} as const satisfies Record<ResponseState, StatusBadgeVariant>;
