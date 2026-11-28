import type { StatusBadgeVariant } from '@/shared/components/ui/StatusBadge';
import type { ServiceStatus } from './schemas/service.schema';

export const serviceStatusBadge = {
  ACTIVE: { label: 'منشورة', variant: 'success' },
  PAUSED: { label: 'متوقفة مؤقتاً', variant: 'warning' },
  ARCHIVED: { label: 'مؤرشفة', variant: 'neutral' },
} as const satisfies Record<ServiceStatus, { label: string; variant: StatusBadgeVariant }>;
