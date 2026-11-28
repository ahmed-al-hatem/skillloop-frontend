import { api } from '@/shared/api/client';
import { paginatedSchema, type Paginated } from '@/shared/api/types';
import {
  AdminUserDetailsSchema,
  AdminUserListItemSchema,
  type AdminUserDetails,
  type AdminUserListItem,
  type MemberListParams,
} from '../schemas/member.schema';

const MembersPageSchema = paginatedSchema(AdminUserListItemSchema);

/** `GET /admin/users` — paginated search. */
export async function getMembers(params: MemberListParams): Promise<Paginated<AdminUserListItem>> {
  const res = await api.get('/admin/users', { params });
  return MembersPageSchema.parse(res.data);
}

/** `GET /admin/users/{id}` — bare object. */
export async function getMember(id: string): Promise<AdminUserDetails> {
  const res = await api.get(`/admin/users/${id}`);
  return AdminUserDetailsSchema.parse(res.data);
}
