import axios, { isAxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { tokenStorage } from '@/shared/lib/token-storage';
import { ApiErrorBodySchema, type ApiError, type FieldError } from './types';

/**
 * Thrown for every failed request. Branch on `code` (stable, from openapi.yaml), show `message`
 * (already translated by the backend), and map `fieldErrors` to form fields.
 */
export class ApiRequestError extends Error implements ApiError {
  code: string;
  status: number;
  details?: FieldError[];
  /** `VALIDATION_ERROR` details as `{ field: message }`, ready for react-hook-form `setError`. */
  fieldErrors: Record<string, string>;

  constructor({ message, code, status, details }: ApiError) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.fieldErrors = Object.fromEntries(
      (details ?? []).map(({ field, message: fieldMessage }) => [field, fieldMessage]),
    );
  }
}

/** Normalizes anything thrown (axios error, network failure, bug) into an ApiRequestError. */
export function toApiError(error: unknown): ApiRequestError {
  if (error instanceof ApiRequestError) return error;

  if (isAxiosError(error)) {
    if (!error.response) {
      return new ApiRequestError({
        message: 'Network error — the server could not be reached.',
        code: 'NETWORK_ERROR',
        status: 0,
      });
    }
    const body = ApiErrorBodySchema.safeParse(error.response.data);
    if (body.success)
      return new ApiRequestError({ ...body.data.error, status: error.response.status });
    return new ApiRequestError({
      message: error.message,
      code: 'UNKNOWN_ERROR',
      status: error.response.status,
    });
  }

  return new ApiRequestError({
    message: error instanceof Error ? error.message : 'Unexpected error',
    code: 'UNKNOWN_ERROR',
    status: 0,
  });
}

/**
 * Called when the API answers 401. The auth feature registers it (shared/ can't import features):
 * it may return a promise that refreshes the token and retries `request` — that result is used
 * instead of the error. If it returns nothing (or no handler is set), the token is cleared and
 * the 401 is rejected.
 */
export type UnauthorizedHandler = (
  error: ApiRequestError,
  request: InternalAxiosRequestConfig,
) => Promise<AxiosResponse> | void;
let onUnauthorized: UnauthorizedHandler | undefined;
export function setUnauthorizedHandler(handler: UnauthorizedHandler | undefined) {
  onUnauthorized = handler;
}

/**
 * Called when the API answers 403 `FORBIDDEN` (e.g. admin role revoked mid-session).
 * Other 403 codes (`EMAIL_NOT_VERIFIED`, `PHONE_REQUIRED`, `ACCOUNT_SUSPENDED`) are left to the caller.
 */
export type ForbiddenHandler = (error: ApiRequestError) => void;
let onForbidden: ForbiddenHandler | undefined;
export function setForbiddenHandler(handler: ForbiddenHandler | undefined) {
  onForbidden = handler;
}

export const api = axios.create({
  baseURL: env.API_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Attach the access token and the UI language (the backend translates error messages).
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept-Language'] = document.documentElement.lang === 'en' ? 'en' : 'ar';
  return config;
});

// Turn every failure into an ApiRequestError and handle 401/403 in one place.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);
    const request = isAxiosError(error) ? error.config : undefined;

    if (apiError.status === 401) {
      const retry = request ? onUnauthorized?.(apiError, request) : undefined;
      if (retry) return retry;
      tokenStorage.clear();
    }
    if (apiError.status === 403 && apiError.code === 'FORBIDDEN') onForbidden?.(apiError);

    return Promise.reject(apiError);
  },
);
