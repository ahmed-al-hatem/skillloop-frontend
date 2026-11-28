import { http, HttpResponse } from 'msw';
import { z } from 'zod';
import { env } from '@/config/env';
import { apiError, paginate, withScenario } from '@/mocks/utils';
import { AdminDisputeSchema, DisputeStatusSchema } from '../schemas/dispute.schema';
import { ResolveDisputeRequestSchema } from '../schemas/resolve-form.schema';
import { disputeFixtures, mockAdmin } from './disputes.fixtures';

const BASE = `${env.API_URL}/admin/disputes`;
const RESPONSE_WINDOW_MS = 48 * 3_600_000;

/** In-memory store: resolving a dispute shows up in the following GETs (until reload). */
// Parsed once so the fixtures can never drift from the schema.
const store = z.array(AdminDisputeSchema).parse(disputeFixtures);

const findDispute = (id: unknown) => store.find((d) => d.id === id);

export const disputesAdminHandlers = [
  http.get(BASE, async ({ request }) => {
    const { response, empty } = await withScenario(request);
    if (response) return response;

    const raw = new URL(request.url).searchParams.get('status') ?? 'OPEN';
    const status = DisputeStatusSchema.safeParse(raw);
    if (!status.success) {
      return apiError('VALIDATION_ERROR', 400, [{ field: 'status', message: 'Invalid status' }]);
    }
    const items = empty
      ? []
      : store
          .filter((d) => d.status === status.data)
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return HttpResponse.json(paginate(items, request.url));
  }),

  http.get(`${BASE}/:id`, async ({ request, params }) => {
    const { response } = await withScenario(request);
    if (response) return response;

    const dispute = findDispute(params.id);
    return dispute ? HttpResponse.json(dispute) : apiError('NOT_FOUND', 404);
  }),

  http.post(`${BASE}/:id/resolve`, async ({ request, params }) => {
    const { response } = await withScenario(request);
    if (response) return response;

    const dispute = findDispute(params.id);
    if (!dispute) return apiError('NOT_FOUND', 404);

    const body = ResolveDisputeRequestSchema.safeParse(await request.json().catch(() => null));
    if (!body.success) {
      const details = body.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return apiError('VALIDATION_ERROR', 400, details);
    }

    const windowOpen =
      !dispute.providerRespondedAt &&
      Date.now() - Date.parse(dispute.createdAt) < RESPONSE_WINDOW_MS;
    if (dispute.status === 'RESOLVED' || windowOpen) {
      return apiError('INVALID_STATE_TRANSITION', 409);
    }

    const now = new Date().toISOString();
    Object.assign(dispute, {
      status: 'RESOLVED',
      ...body.data,
      resolvedAt: now,
      resolvedBy: mockAdmin,
      canResolve: false,
      booking: { ...dispute.booking, status: 'RESOLVED', updatedAt: now },
      events: [
        ...dispute.events,
        {
          id: crypto.randomUUID(),
          action: 'RESOLVED',
          fromStatus: 'DISPUTED',
          toStatus: 'RESOLVED',
          actorRole: 'ADMIN',
          actor: mockAdmin,
          note: body.data.adminNote,
          createdAt: now,
        },
      ],
    } satisfies Partial<typeof dispute>);
    return HttpResponse.json(dispute);
  }),
];
