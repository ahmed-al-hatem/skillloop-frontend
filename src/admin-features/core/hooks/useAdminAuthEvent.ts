import { useSyncExternalStore } from 'react';
import type { AuthInterceptorOptions } from '@/features/auth';
import { ROUTES } from '@/shared/constants/routes';

/** What the global API handlers told the admin guard: nothing, a 403 `FORBIDDEN`, or a dead session. */
export type AdminAuthEvent = 'none' | 'forbidden' | 'expired';

let current: AdminAuthEvent = 'none';
const listeners = new Set<() => void>();

function setEvent(next: AdminAuthEvent) {
  if (current === next) return;
  current = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const isOnAdminPage = () => {
  const { pathname } = window.location;
  return pathname === ROUTES.admin.root || pathname.startsWith(`${ROUTES.admin.root}/`);
};

/**
 * Passed to `registerAuthInterceptors` once in `src/app/`. Only reacts on `/admin/*` pages:
 * a refresh that failed → session expired; a 403 `FORBIDDEN` (role revoked) → forbidden.
 * The auth feature already clears the tokens / refetches `me` before calling these.
 */
export const adminAuthHandlers = {
  onSessionExpired: () => {
    if (isOnAdminPage()) setEvent('expired');
  },
  onForbidden: () => {
    if (isOnAdminPage()) setEvent('forbidden');
  },
} satisfies AuthInterceptorOptions;

/** Clears the last event (on the session-expired page, after a new login). */
export function resetAdminAuthEvent() {
  setEvent('none');
}

export function useAdminAuthEvent() {
  return useSyncExternalStore(subscribe, () => current);
}
