import { api } from '@/shared/api/client';
import { AdminDashboardSchema } from '../schemas/dashboard.schema';

/** `GET /admin/dashboard` (admin only). Bare object, no envelope. */
export async function getAdminDashboard() {
  const res = await api.get('/admin/dashboard');
  return AdminDashboardSchema.parse(res.data);
}
