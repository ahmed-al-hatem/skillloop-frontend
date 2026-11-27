const ACCESS_KEY = 'skillloop.accessToken';
const REFRESH_KEY = 'skillloop.refreshToken';

/** The only place that reads or writes the stored tokens. */
export const tokenStorage = {
  get: () => localStorage.getItem(ACCESS_KEY),
  set: (token: string) => localStorage.setItem(ACCESS_KEY, token),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  /** Saves both tokens after login or a refresh (the refresh token rotates every time). */
  setTokens: ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
