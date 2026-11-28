import { api } from '@/shared/api/client';
import { paginatedSchema, type Paginated } from '@/shared/api/types';
import {
  AdminDisputeSchema,
  type AdminDispute,
  type DisputeListParams,
} from '../schemas/dispute.schema';
import type { ResolveDisputeRequest } from '../schemas/resolve-form.schema';

/** `GET /admin/disputes` — paginated, oldest first, filtered by `status`. */
export async function getDisputes(params: DisputeListParams): Promise<Paginated<AdminDispute>> {
  const res = await api.get('/admin/disputes', { params });
  return paginatedSchema(AdminDisputeSchema).parse(res.data);
}

/** `GET /admin/disputes/{id}` — bare object with all evidence. */
export async function getDispute(id: string): Promise<AdminDispute> {
  const res = await api.get(`/admin/disputes/${id}`);
  return AdminDisputeSchema.parse(res.data);
}

/** `POST /admin/disputes/{id}/resolve` — final decision; returns the updated dispute. */
export async function resolveDispute(
  id: string,
  body: ResolveDisputeRequest,
): Promise<AdminDispute> {
  const res = await api.post(`/admin/disputes/${id}/resolve`, body);
  return AdminDisputeSchema.parse(res.data);
}
