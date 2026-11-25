const KEY = 'skillloop.accessToken';

/** The only place that reads or writes the stored access token. */
export const tokenStorage = {
  get: () => localStorage.getItem(KEY),
  set: (token: string) => localStorage.setItem(KEY, token),
  clear: () => localStorage.removeItem(KEY),
};
