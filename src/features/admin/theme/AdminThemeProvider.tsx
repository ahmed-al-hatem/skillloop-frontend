import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { useMemo, type ReactNode } from 'react';
import { createAdminCache, type Direction } from './createAdminCache';
import { createAdminTheme } from './createAdminTheme';

export type AdminThemeProviderProps = {
  children: ReactNode;
};

/** The page direction comes from `<html dir>` (RTL for Arabic, LTR for English). */
const readDirection = (): Direction => (document.documentElement.dir === 'ltr' ? 'ltr' : 'rtl');

/** Wraps the admin area: RTL-aware Emotion cache + the brand MUI theme. */
export function AdminThemeProvider({ children }: AdminThemeProviderProps) {
  const direction = readDirection();
  const cache = useMemo(() => createAdminCache(direction), [direction]);
  const theme = useMemo(() => createAdminTheme(direction), [direction]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
