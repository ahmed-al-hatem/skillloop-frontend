import type { TimelineTone } from '@/shared/components/Timeline';
import type { StatusBadgeVariant } from '@/shared/components/ui/StatusBadge';
import type { ResponseState } from './lib/responseState';
import type {
  BookingEvent,
  BookingStatus,
  DisputeDecision,
  DisputeReason,
  DisputeStatus,
} from './schemas/dispute.schema';

/**
 * The 8 real `BookingStatus` values from `openapi.yaml`, in the overview chart's order (the
 * design's "قيد التنفيذ" does not exist in the contract, plan §11.3). Lives here with
 * `BookingStatus` until a bookings feature owns it.
 */
export const BOOKING_STATUS_LABELS = {
  PENDING: 'معلق',
  ACCEPTED: 'مقبول',
  DELIVERED: 'مُسلَّم',
  COMPLETED: 'مكتمل',
  DISPUTED: 'متنازع عليه',
  RESOLVED: 'تمّ الحل',
  CANCELLED: 'ملغى',
  DECLINED: 'مرفوض',
} as const satisfies Record<BookingStatus, string>;

export const BOOKING_STATUS_VARIANTS = {
  PENDING: 'neutral',
  ACCEPTED: 'info',
  DELIVERED: 'info',
  COMPLETED: 'success',
  DISPUTED: 'danger',
  RESOLVED: 'success',
  CANCELLED: 'neutral',
  DECLINED: 'neutral',
} as const satisfies Record<BookingStatus, StatusBadgeVariant>;

/**
 * Timeline rows for `BookingEvent.action` (BOOK-15). The contract types `action` as a free string,
 * so an unknown action falls back to its raw value.
 */
export const BOOKING_EVENT_LABELS: Record<string, { label: string; tone: TimelineTone }> = {
  CREATED: { label: 'إنشاء الحجز', tone: 'neutral' },
  ACCEPTED: { label: 'قبول الحجز', tone: 'info' },
  DECLINED: { label: 'رفض الحجز', tone: 'neutral' },
  CANCELLED: { label: 'إلغاء الحجز', tone: 'neutral' },
  EXPIRED: { label: 'انتهاء صلاحية الطلب', tone: 'neutral' },
  SCHEDULE_SET: { label: 'تحديد الموعد', tone: 'info' },
  DELIVERED: { label: 'تسليم العمل', tone: 'success' },
  CHANGES_REQUESTED: { label: 'طلب تعديل', tone: 'warning' },
  CONFIRMED: { label: 'تأكيد الاستلام', tone: 'success' },
  AUTO_COMPLETED: { label: 'اكتمال تلقائي', tone: 'success' },
  DISPUTED: { label: 'فتح نزاع', tone: 'danger' },
  RESOLVED: { label: 'حل النزاع', tone: 'primary' },
};

export const ACTOR_ROLE_LABELS = {
  RECEIVER: 'المستلم',
  PROVIDER: 'مقدم الخدمة',
  SYSTEM: 'النظام',
  ADMIN: 'الأدمن',
} as const satisfies Record<BookingEvent['actorRole'], string>;

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

/** Decision cards of the resolve form (the list keeps `DISPUTE_DECISION_LABELS`). */
export const RESOLVE_DECISION_OPTIONS = {
  REFUND_RECEIVER: {
    label: 'استرداد للمستلم 100%',
    description: (receiver: string) => `تعود النقاط كاملة إلى ${receiver}`,
  },
  PAY_PROVIDER: {
    label: 'دفع لمقدم الخدمة',
    description: (_receiver: string, provider: string) => `تُحوَّل النقاط كاملة إلى ${provider}`,
  },
  SPLIT: {
    label: 'تقسيم',
    description: () => 'نسبة للمستلم من 1 إلى 99%',
  },
} as const satisfies Record<
  DisputeDecision,
  { label: string; description: (receiver: string, provider: string) => string }
>;

/** Line next to the resolve button: why it is disabled, or that it is ready. */
export const RESOLVE_GATE_TEXT = {
  locked: 'زر الحل معطّل حتى يرد مقدم الخدمة أو تنتهي مهلة 48 ساعة.',
  offline: 'لا يمكن حل النزاع دون اتصال بالإنترنت.',
  incomplete: `اختر القرار واكتب ملاحظة من ${ADMIN_NOTE_MIN} إلى ${ADMIN_NOTE_MAX} حرف لتفعيل الحل.`,
  ready: 'جاهز للحل.',
} as const;
