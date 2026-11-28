import type { TimelineTone } from '@/shared/components/Timeline';
import type { StatusBadgeVariant } from '@/shared/components/ui/StatusBadge';
import type { BookingEvent, BookingStatus, ServiceType } from './schemas/booking.schema';

/**
 * The 8 real `BookingStatus` values from `openapi.yaml`, in lifecycle order (the design's
 * «قيد التنفيذ» does not exist in the contract, plan §11.3).
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

/** Badge colour per status (the label always goes with it). */
export const BOOKING_STATUS_VARIANTS = {
  PENDING: 'warning',
  ACCEPTED: 'info',
  DELIVERED: 'info',
  COMPLETED: 'success',
  DISPUTED: 'danger',
  RESOLVED: 'success',
  CANCELLED: 'neutral',
  DECLINED: 'neutral',
} as const satisfies Record<BookingStatus, StatusBadgeVariant>;

/** Statuses in display order (filters, charts). */
export const BOOKING_STATUSES = Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[];

export const SERVICE_TYPE_LABELS = {
  SESSION: 'جلسة',
  DELIVERABLE: 'تسليم عمل',
} as const satisfies Record<ServiceType, string>;

/** `BookingEvent.action` is a free string in the contract: unknown actions show as sent. */
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
