import { api } from '@/shared/api/client';
import { paginatedSchema, type Paginated } from '@/shared/api/types';
import type { PointsAdjustmentRequest, SuspendRequest } from '../schemas/member-forms.schema';
import {
  AdminUserDetailsSchema,
  AdminUserListItemSchema,
  WalletTransactionSchema,
  type AdminUserDetails,
  type AdminUserListItem,
  type MemberListParams,
  type WalletTransaction,
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

/** `POST /admin/users/{id}/suspend` — returns the updated member. 409 if already suspended. */
export async function suspendMember(id: string, body: SuspendRequest): Promise<AdminUserDetails> {
  const res = await api.post(`/admin/users/${id}/suspend`, body);
  return AdminUserDetailsSchema.parse(res.data);
}

/** `POST /admin/users/{id}/unsuspend` — returns the updated member. 409 if not suspended. */
export async function unsuspendMember(id: string): Promise<AdminUserDetails> {
  const res = await api.post(`/admin/users/${id}/unsuspend`);
  return AdminUserDetailsSchema.parse(res.data);
}

/** `POST /admin/users/{id}/points-adjustment` — returns the `ADMIN_ADJUSTMENT` transaction. */
export async function adjustMemberPoints(
  id: string,
  body: PointsAdjustmentRequest,
): Promise<WalletTransaction> {
  const res = await api.post(`/admin/users/${id}/points-adjustment`, body);
  return WalletTransactionSchema.parse(res.data);
}
