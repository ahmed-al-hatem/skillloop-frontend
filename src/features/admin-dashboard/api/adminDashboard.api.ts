import { api } from '@/shared/api/client';
import { AdminDashboardSchema, type AdminDashboard } from '../schemas/adminDashboard.schema';

/** `GET /admin/dashboard` — admin only (401 UNAUTHENTICATED, 403 FORBIDDEN). */
export async function getAdminDashboard(): Promise<AdminDashboard> {
  const res = await api.get('/admin/dashboard');
  return AdminDashboardSchema.parse(res.data);
}
