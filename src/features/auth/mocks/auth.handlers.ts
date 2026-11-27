import { http, HttpResponse } from 'msw';
import { env } from '@/config/env';
import { apiError, withScenario } from '@/mocks/utils';
import { mockAccounts } from './auth.data';

/*
 * Fake tokens that survive a page reload:
 *   access  = `mock-access.<userId>.<expiresAtMs>`  (15 min, like the real API)
 *   refresh = `mock-refresh.<userId>.<random>`      (rotated on every refresh)
 * Used refresh tokens are remembered, so replaying an old one fails with INVALID_TOKEN.
 */
const ACCESS_TTL_SECONDS = 900;
const usedRefreshTokens = new Set<string>();

const findById = (id: string | undefined) => mockAccounts.find((a) => a.user.id === id);

function issueTokens(userId: string) {
  return {
    accessToken: `mock-access.${userId}.${Date.now() + ACCESS_TTL_SECONDS * 1000}`,
    refreshToken: `mock-refresh.${userId}.${crypto.randomUUID()}`,
    accessTokenExpiresIn: ACCESS_TTL_SECONDS,
  };
}

/** The account behind a valid, unexpired `Authorization: Bearer` header. */
function accountFromRequest(request: Request) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer /, '') ?? '';
  const [kind, userId, expiresAt] = token.split('.');
  if (kind !== 'mock-access' || Number(expiresAt) < Date.now()) return undefined;
  return findById(userId);
}

function readRefreshToken(body: unknown) {
  const value = (body as { refreshToken?: unknown } | null)?.refreshToken;
  return typeof value === 'string' ? value : undefined;
}

export const authHandlers = [
  http.post(`${env.API_URL}/auth/login`, async ({ request }) => {
    const { response } = await withScenario(request);
    if (response) return response;

    const body = (await request.json()) as { email?: string; password?: string } | null;
    const account = mockAccounts.find(
      (a) => a.user.email === body?.email?.trim().toLowerCase() && a.password === body?.password,
    );
    if (!account) return apiError('INVALID_CREDENTIALS', 401);
    if (account.suspended) return apiError('ACCOUNT_SUSPENDED', 403);

    return HttpResponse.json({
      user: account.user,
      tokens: issueTokens(account.user.id),
      needsPhone: account.user.needsPhone,
    });
  }),

  http.post(`${env.API_URL}/auth/refresh`, async ({ request }) => {
    const refreshToken = readRefreshToken(await request.json());
    if (!refreshToken) {
      return apiError('VALIDATION_ERROR', 400, [{ field: 'refreshToken', message: 'Required' }]);
    }

    const [kind, userId] = refreshToken.split('.');
    const account = findById(userId);
    if (kind !== 'mock-refresh' || !account || usedRefreshTokens.has(refreshToken)) {
      return apiError('INVALID_TOKEN', 401);
    }
    if (account.suspended) return apiError('ACCOUNT_SUSPENDED', 403);

    usedRefreshTokens.add(refreshToken);
    return HttpResponse.json(issueTokens(account.user.id));
  }),

  http.post(`${env.API_URL}/auth/logout`, async ({ request }) => {
    if (!accountFromRequest(request)) return apiError('UNAUTHENTICATED', 401);
    const refreshToken = readRefreshToken(await request.json());
    if (refreshToken) usedRefreshTokens.add(refreshToken);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${env.API_URL}/me`, async ({ request }) => {
    const { response } = await withScenario(request);
    if (response) return response;

    const account = accountFromRequest(request);
    if (!account) return apiError('UNAUTHENTICATED', 401);
    return HttpResponse.json(account.user);
  }),
];
