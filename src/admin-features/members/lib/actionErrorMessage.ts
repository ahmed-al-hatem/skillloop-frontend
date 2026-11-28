import type { ApiRequestError } from '@/shared/api/client';

/**
 * Text for a failed member action. 4xx: the backend's message (a field detail first).
 * Network and 5xx carry no useful text for the admin, so they get `fallback`.
 */
export function actionErrorMessage(error: ApiRequestError, fallback: string, field?: string) {
  if (error.status === 0 || error.status >= 500) return `${fallback} حاول مرة أخرى.`;
  return (field && error.fieldErrors[field]) || error.message;
}
