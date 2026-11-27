import { delay, http, HttpResponse } from 'msw';
import { env } from '@/config/env';
import { adminDashboard } from './adminDashboard.data';

export const adminDashboardHandlers = [
  http.get(`${env.API_URL}/admin/dashboard`, async () => {
    await delay(500);
    return HttpResponse.json(adminDashboard);
  }),
];
