import { http, HttpResponse } from 'msw';
import { env } from '@/config/env';
import { apiError, paginate, withScenario } from '@/mocks/utils';
import {
  AdminUserListItemSchema,
  type AdminUserDetails,
  type AdminUserListItem,
} from '../schemas/member.schema';
import { memberFixtures } from './members.fixtures';

/** In-memory store: mutations show up in the following GETs until the page reloads. */
const store = new Map(memberFixtures.map((m) => [m.id, structuredClone(m)]));

const base = `${env.API_URL}/admin/users`;

/** List rows carry fewer fields than the detail: the schema strips the rest. */
const toListItem = (m: AdminUserDetails): AdminUserListItem => AdminUserListItemSchema.parse(m);

function matches(m: AdminUserDetails, params: URLSearchParams) {
  const q = params.get('q')?.trim().toLowerCase();
  const status = params.get('status');
  const role = params.get('role');
  if (status && m.status !== status) return false;
  if (role && m.role !== role) return false;
  if (!q) return true;
  return [m.fullName, m.email, m.phone ?? ''].some((v) => v.toLowerCase().includes(q));
}

export const membersAdminHandlers = [
  http.get(base, async ({ request }) => {
    const { response, empty } = await withScenario(request);
    if (response) return response;
    const params = new URL(request.url).searchParams;
    const items = empty
      ? []
      : [...store.values()]
          .filter((m) => matches(m, params))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map(toListItem);
    return HttpResponse.json(paginate(items, request.url));
  }),

  http.get(`${base}/:id`, async ({ request, params }) => {
    const { response } = await withScenario(request);
    if (response) return response;
    const member = store.get(String(params.id));
    return member ? HttpResponse.json(member) : apiError('NOT_FOUND', 404);
  }),
];
