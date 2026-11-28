import { http, HttpResponse } from 'msw';
import { env } from '@/config/env';
import { apiError, withScenario } from '@/mocks/utils';
import { buildDashboardFixture, buildEmptyDashboardFixture } from './overview.fixtures';

/*
 * `GET /admin/dashboard`: bare `AdminDashboard` object, like the contract.
 * Demo the states with `?__mock=empty|error|slow|forbidden` (see `withScenario`).
 * No `paginate` here: the response is a single object, not a list.
 */
export const overviewAdminHandlers = [
  http.get(`${env.API_URL}/admin/dashboard`, async ({ request }) => {
    const { response, empty } = await withScenario(request);
    if (response) return response;
    if (!request.headers.get('Authorization')) return apiError('UNAUTHENTICATED', 401);
    return HttpResponse.json(empty ? buildEmptyDashboardFixture() : buildDashboardFixture());
  }),
];
