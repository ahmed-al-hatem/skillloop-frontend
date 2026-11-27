import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tokenStorage } from '@/shared/lib/token-storage';
import type { LoginRequest } from '../schemas/auth.schema';
import { getMe, login, logout } from './auth.api';

export const meQueryKey = ['me'] as const;

/** The logged-in member (`GET /me`). Stays idle with no data when there is no stored token. */
export function useCurrentUser() {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
    enabled: Boolean(tokenStorage.get()),
  });
}

/** Logs in, stores the tokens and seeds the `me` cache with the returned user. */
export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginRequest) => login(body),
    onSuccess: ({ user, tokens }) => {
      tokenStorage.setTokens(tokens);
      queryClient.setQueryData(meQueryKey, user);
    },
  });
}

/** Cancels the refresh token on the server (best effort), then clears tokens and all cached data. */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const refreshToken = tokenStorage.getRefresh();
      if (refreshToken) await logout(refreshToken).catch(() => undefined);
    },
    onSettled: () => {
      tokenStorage.clear();
      queryClient.clear();
    },
  });
}
