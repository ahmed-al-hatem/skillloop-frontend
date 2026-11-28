import { http, HttpResponse } from 'msw';
import { env } from '@/config/env';
import { apiError, paginate, withScenario, type ApiErrorDetail } from '@/mocks/utils';
import {
  PointsAdjustmentRequestSchema,
  SuspendRequestSchema,
} from '../schemas/member-forms.schema';
import {
  AdminUserListItemSchema,
  type AdminUserDetails,
  type AdminUserListItem,
} from '../schemas/member.schema';
import { memberFixtures } from './members.fixtures';

/** In-memory store: mutations show up in the following GETs until the page reloads. */
const store = new Map(memberFixtures.map((m) => [m.id, structuredClone(m)]));

const RECENT_TRANSACTIONS = 20;
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

/** Zod issues → contract `details[]` for a 400 VALIDATION_ERROR. */
function validationError(issues: { path: PropertyKey[]; message: string }[]) {
  const details: ApiErrorDetail[] = issues.map((i) => ({
    field: String(i.path[0] ?? ''),
    message: i.message,
  }));
  return apiError('VALIDATION_ERROR', 400, details);
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

  http.post(`${base}/:id/suspend`, async ({ request, params }) => {
    const { response } = await withScenario(request);
    if (response) return response;
    const member = store.get(String(params.id));
    if (!member) return apiError('NOT_FOUND', 404);
    const body = SuspendRequestSchema.safeParse(await request.json().catch(() => null));
    if (!body.success) return validationError(body.error.issues);
    if (member.status === 'SUSPENDED') return apiError('INVALID_STATE_TRANSITION', 409);
    Object.assign(member, {
      status: 'SUSPENDED',
      suspendedReason: body.data.reason,
      suspendedAt: new Date().toISOString(),
    } satisfies Partial<AdminUserDetails>);
    return HttpResponse.json(member);
  }),

  http.post(`${base}/:id/unsuspend`, async ({ request, params }) => {
    const { response } = await withScenario(request);
    if (response) return response;
    const member = store.get(String(params.id));
    if (!member) return apiError('NOT_FOUND', 404);
    if (member.status === 'ACTIVE') return apiError('INVALID_STATE_TRANSITION', 409);
    Object.assign(member, {
      status: 'ACTIVE',
      suspendedReason: null,
      suspendedAt: null,
    } satisfies Partial<AdminUserDetails>);
    return HttpResponse.json(member);
  }),

  http.post(`${base}/:id/points-adjustment`, async ({ request, params }) => {
    const { response } = await withScenario(request);
    if (response) return response;
    const member = store.get(String(params.id));
    if (!member) return apiError('NOT_FOUND', 404);
    const body = PointsAdjustmentRequestSchema.safeParse(await request.json().catch(() => null));
    if (!body.success) return validationError(body.error.issues);
    const availableAfter = member.pointsAvailable + body.data.amount;
    if (availableAfter < 0)
      return apiError('INSUFFICIENT_POINTS', 422, undefined, 'الرصيد المتاح لا يكفي لهذا الخصم');
    const transaction = {
      id: crypto.randomUUID(),
      type: 'ADMIN_ADJUSTMENT',
      availableChange: body.data.amount,
      heldChange: 0,
      availableAfter,
      heldAfter: member.pointsHeld,
      bookingId: null,
      note: body.data.reason,
      createdAt: new Date().toISOString(),
    } as const;
    member.pointsAvailable = availableAfter;
    member.recentTransactions = [transaction, ...member.recentTransactions].slice(
      0,
      RECENT_TRANSACTIONS,
    );
    return HttpResponse.json(transaction);
  }),
];
