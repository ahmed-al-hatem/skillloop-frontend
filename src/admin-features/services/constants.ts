import type { StatusBadgeVariant } from '@/shared/components/ui/StatusBadge';
import type { ServiceStatus } from './schemas/service.schema';

type BadgeSpec = { label: string; variant: StatusBadgeVariant };

export const serviceStatusBadge = {
  ACTIVE: { label: 'منشورة', variant: 'success' },
  PAUSED: { label: 'متوقفة مؤقتاً', variant: 'info' },
  ARCHIVED: { label: 'مؤرشفة', variant: 'neutral' },
} as const satisfies Record<ServiceStatus, BadgeSpec>;

/** 🟡 `isHidden`: the provider is suspended, so the service is out of the market. */
export const hiddenServiceBadge = {
  label: 'مخفية (عضو موقوف)',
  variant: 'warning',
} as const satisfies BadgeSpec;
