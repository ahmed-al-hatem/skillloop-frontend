import type { StatusBadgeVariant } from '@/shared/components/ui/StatusBadge';
import type { TransactionType, UserStatus } from './schemas/member.schema';

export const memberStatusBadge = {
  ACTIVE: { label: 'نشط', variant: 'success' },
  SUSPENDED: { label: 'موقوف', variant: 'danger' },
} as const satisfies Record<UserStatus, { label: string; variant: StatusBadgeVariant }>;

export const transactionTypeLabel = {
  WELCOME_BONUS: 'مكافأة ترحيب',
  BOOKING_HOLD: 'حجز نقاط',
  BOOKING_REFUND: 'استرجاع حجز',
  BOOKING_PAYMENT: 'دفع حجز',
  BOOKING_EARNING: 'أرباح حجز',
  DISPUTE_REFUND: 'استرجاع نزاع',
  DISPUTE_EARNING: 'أرباح نزاع',
  ADMIN_ADJUSTMENT: 'تعديل إداري',
} as const satisfies Record<TransactionType, string>;
