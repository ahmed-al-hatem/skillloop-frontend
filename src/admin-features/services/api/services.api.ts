import { api } from '@/shared/api/client';
import { paginatedSchema, type Paginated } from '@/shared/api/types';
import {
  ServiceSchema,
  type ArchiveRequest,
  type Service,
  type ServiceListParams,
} from '../schemas/service.schema';

const ServicesPageSchema = paginatedSchema(ServiceSchema);

/** `GET /admin/services` — paginated search over all statuses. Empty `q` is not sent. */
export async function getServices({
  q,
  ...params
}: ServiceListParams): Promise<Paginated<Service>> {
  const res = await api.get('/admin/services', { params: { ...params, q: q || undefined } });
  return ServicesPageSchema.parse(res.data);
}

/** `POST /admin/services/{id}/archive` — final. Returns the archived service. 409 if already archived. */
export async function archiveService(id: string, body: ArchiveRequest): Promise<Service> {
  const res = await api.post(`/admin/services/${id}/archive`, body);
  return ServiceSchema.parse(res.data);
}
