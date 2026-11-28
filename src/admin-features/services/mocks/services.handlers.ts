import { http, HttpResponse } from 'msw';
import { env } from '@/config/env';
import { apiError, paginate, withScenario } from '@/mocks/utils';
import { ArchiveRequestSchema, type Service } from '../schemas/service.schema';
import { serviceFixtures } from './services.fixtures';

/** In-memory store: an archive shows up in the following GETs until the page reloads. */
const store = new Map(serviceFixtures.map((s) => [s.id, structuredClone(s)]));

const base = `${env.API_URL}/admin/services`;

function matches(s: Service, params: URLSearchParams) {
  const q = params.get('q')?.trim().toLowerCase();
  const status = params.get('status');
  const categoryId = params.get('categoryId');
  const providerId = params.get('providerId');
  if (status && s.status !== status) return false;
  if (categoryId && s.category.id !== categoryId) return false;
  if (providerId && s.provider.id !== providerId) return false;
  if (!q) return true;
  return [s.title, s.provider.fullName].some((v) => v.toLowerCase().includes(q));
}

export const servicesAdminHandlers = [
  http.get(base, async ({ request }) => {
    const { response, empty } = await withScenario(request);
    if (response) return response;
    const params = new URL(request.url).searchParams;
    const items = empty
      ? []
      : [...store.values()]
          .filter((s) => matches(s, params))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return HttpResponse.json(paginate(items, request.url));
  }),

  http.post(`${base}/:id/archive`, async ({ request, params }) => {
    const { response } = await withScenario(request);
    if (response) return response;
    const service = store.get(String(params.id));
    if (!service) return apiError('NOT_FOUND', 404);
    const body = ArchiveRequestSchema.safeParse(await request.json().catch(() => null));
    if (!body.success) {
      const details = body.error.issues.map((i) => ({
        field: String(i.path[0] ?? ''),
        message: i.message,
      }));
      return apiError('VALIDATION_ERROR', 400, details);
    }
    if (service.status === 'ARCHIVED') return apiError('INVALID_STATE_TRANSITION', 409);
    Object.assign(service, {
      status: 'ARCHIVED',
      isHidden: false,
      updatedAt: new Date().toISOString(),
    } satisfies Partial<Service>);
    return HttpResponse.json(service);
  }),
];
