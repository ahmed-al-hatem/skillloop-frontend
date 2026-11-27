import axios, { isAxiosError } from 'axios';
import { env } from '@/config/env';
import { tokenStorage } from '@/shared/lib/token-storage';
import { ApiErrorBodySchema, type ApiError, type FieldError } from './types';

/**
 * Thrown for every failed request. Read `code` (stable, from openapi.yaml), show `message`
 * (already translated by the backend), and map `details` to form fields with `fieldErrors()`.
 */
export class ApiRequestError extends Error implements ApiError {
  code: string;
  status: number;
  details?: FieldError[];

  constructor({ message, code, status, details }: ApiError) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
    this.details = details;
  }

  /** `VALIDATION_ERROR` details as `{ field: message }`, ready for react-hook-form `setError`. */
  fieldErrors(): Record<string, string> {
    return Object.fromEntries((this.details ?? []).map(({ field, message }) => [field, message]));
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
 * Called when the API answers 401. The auth feature registers what should happen
 * (clear its state, go to /login). shared/ can't import features, so it is injected.
 * Refresh-token rotation (`POST /auth/refresh`) is added with the auth feature.
 */
let onUnauthorized: (() => void) | undefined;
export function setUnauthorizedHandler(handler: (() => void) | undefined) {
  onUnauthorized = handler;
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

// Turn every failure into an ApiRequestError and handle expired sessions in one place.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);
    if (apiError.status === 401) {
      tokenStorage.clear();
      onUnauthorized?.();
    }
    return Promise.reject(apiError);
  },
);
