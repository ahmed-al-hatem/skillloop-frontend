import { delay, HttpResponse } from 'msw';

/** Shared helpers for feature MSW handlers. Shapes follow `openapi.yaml` (PageMeta, Error). */

const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 20;

export type PageMeta = { page: number; pageSize: number; total: number };

function readInt(params: URLSearchParams, key: string, fallback: number) {
  const value = Number(params.get(key));
  return Number.isInteger(value) && value >= 1 ? value : fallback;
}

/** Slices `items` by `?page` / `?pageSize` (default 1 / 20, pageSize max 50). */
export function paginate<T>(items: readonly T[], url: string): { data: T[]; meta: PageMeta } {
  const params = new URL(url).searchParams;
  const page = readInt(params, 'page', 1);
  const pageSize = Math.min(readInt(params, 'pageSize', DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    meta: { page, pageSize, total: items.length },
  };
}

/** Error codes from the error table in `openapi.yaml`, plus a generic 500. */
export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_TOKEN'
  | 'FORBIDDEN'
  | 'EMAIL_NOT_VERIFIED'
  | 'PHONE_REQUIRED'
  | 'ACCOUNT_SUSPENDED'
  | 'NOT_FOUND'
  | 'EMAIL_TAKEN'
  | 'PHONE_TAKEN'
  | 'ALREADY_EXISTS'
  | 'INVALID_STATE_TRANSITION'
  | 'DUPLICATE_OPEN_BOOKING'
  | 'ALREADY_REVIEWED'
  | 'DISPUTE_EXISTS'
  | 'INSUFFICIENT_POINTS'
  | 'PRICE_OUT_OF_RANGE'
  | 'CANNOT_BOOK_OWN_SERVICE'
  | 'SERVICE_NOT_AVAILABLE'
  | 'LIMIT_REACHED'
  | 'REVIEW_WINDOW_CLOSED'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

export type ApiErrorDetail = { field: string; message: string };

/** Error response in the contract shape: `{ error: { code, message, details } }`. */
export function apiError(
  code: ApiErrorCode,
  status: number,
  details?: ApiErrorDetail[],
  message: string = code,
) {
  return HttpResponse.json({ error: { code, message, details } }, { status });
}

export type MockScenario = 'empty' | 'error' | 'slow' | 'forbidden';

const SCENARIOS: readonly MockScenario[] = ['empty', 'error', 'slow', 'forbidden'];
const SCENARIO_KEY = '__mock';

function readScenario(request: Request): MockScenario | null {
  const value =
    new URL(request.url).searchParams.get(SCENARIO_KEY) ??
    new URLSearchParams(window.location.search).get(SCENARIO_KEY) ??
    window.localStorage.getItem(SCENARIO_KEY);
  return SCENARIOS.find((scenario) => scenario === value) ?? null;
}

/**
 * Call first in every handler. Waits a realistic delay (long for `slow`), returns a ready
 * response for `error` / `forbidden`, and `empty: true` when the handler should return no data.
 * Pick a scenario with `?__mock=…` on the page or request URL, or `localStorage.__mock`.
 */
export async function withScenario(
  request: Request,
): Promise<{ response: Response | null; empty: boolean }> {
  const scenario = readScenario(request);
  await delay(scenario === 'slow' ? 3000 : 'real');
  if (scenario === 'error') return { response: apiError('INTERNAL_ERROR', 500), empty: false };
  if (scenario === 'forbidden') return { response: apiError('FORBIDDEN', 403), empty: false };
  return { response: null, empty: scenario === 'empty' };
}
