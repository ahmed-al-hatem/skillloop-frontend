// Public API of the admin services feature. Other code imports ONLY from '@/admin-features/services'.
// Mocks are never exported here, so fake data stays out of the production bundle.
export { serviceKeys } from './api/services.keys';
export { useArchiveService, useServices } from './api/services.queries';
export { serviceStatusBadge } from './constants';
export {
  ARCHIVE_REASON_MAX,
  ARCHIVE_REASON_MIN,
  ArchiveRequestSchema,
  ServiceListParamsSchema,
  ServiceSchema,
  ServiceStatusSchema,
  type ArchiveRequest,
  type Service,
  type ServiceListParams,
  type ServiceStatus,
} from './schemas/service.schema';
