import type { QueryClient } from '@tanstack/react-query';
import {
  api,
  setForbiddenHandler,
  setUnauthorizedHandler,
  type ApiRequestError,
} from '@/shared/api/client';
import { tokenStorage } from '@/shared/lib/token-storage';
import { refreshTokens } from './auth.api';
import { meQueryKey } from './auth.queries';

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Set on a request replayed after a refresh, so it is never refreshed twice. */
    authRetried?: boolean;
  }
}

export type AuthInterceptorOptions = {
  /** Refresh failed or was impossible: show the session-expired page / go to login. */
  onSessionExpired?: (error: ApiRequestError) => void;
  /** A request got 403 `FORBIDDEN` (e.g. admin role revoked). `me` is already being refetched. */
  onForbidden?: (error: ApiRequestError) => void;
};

/** Login/refresh/logout answer 401 for their own reasons: never refresh for them. */
const isAuthEndpoint = (url = '') => url.startsWith('/auth/');

/** One refresh at a time: requests that fail together all wait for the same promise. */
let refreshing: Promise<string> | null = null;

function refreshAccessToken() {
  refreshing ??= (async () => {
    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) throw new Error('No refresh token');
    const tokens = await refreshTokens(refreshToken);
    tokenStorage.setTokens(tokens);
    return tokens.accessToken;
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

/**
 * Wires the auth feature into the shared API client: on 401, refresh the token once
 * (`POST /auth/refresh`, rotation) and replay the request; on 403 `FORBIDDEN`, refetch `me`.
 * Call once at app start. Returns a function that removes the handlers.
 */
export function registerAuthInterceptors(
  queryClient: QueryClient,
  { onSessionExpired, onForbidden }: AuthInterceptorOptions = {},
) {
  setUnauthorizedHandler((error, request) => {
    if (isAuthEndpoint(request.url)) return;

    const expire = () => {
      tokenStorage.clear();
      queryClient.removeQueries({ queryKey: meQueryKey });
      onSessionExpired?.(error);
    };
    if (request.authRetried || !tokenStorage.getRefresh()) {
      expire();
      return;
    }

    return refreshAccessToken().then(
      (accessToken) => {
        request.authRetried = true;
        request.headers.Authorization = `Bearer ${accessToken}`;
        return api.request(request);
      },
      () => {
        expire();
        throw error;
      },
    );
  });

  setForbiddenHandler((error) => {
    void queryClient.invalidateQueries({ queryKey: meQueryKey });
    onForbidden?.(error);
  });

  return () => {
    setUnauthorizedHandler(undefined);
    setForbiddenHandler(undefined);
  };
}
