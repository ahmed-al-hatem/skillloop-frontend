import { ROUTES } from '@/shared/constants/routes';

/** `path?next=<encoded next>`, so the target page can send the user back where they were. */
export const withNext = (path: string, next: string) => `${path}?next=${encodeURIComponent(next)}`;

/** A `next` value that is safe to navigate to: an in-app path only (never `//host` or a full URL). */
export function safeNext(value: string | null) {
  if (value?.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')) return value;
  return ROUTES.admin.root;
}
