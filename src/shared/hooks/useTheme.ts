import { useCallback, useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

/** Also read by the inline script in index.html that applies the theme before paint. */
export const THEME_STORAGE_KEY = 'sl-theme';
const CHANGE_EVENT = 'sl-theme-change';

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'light') root.dataset.theme = 'light';
  else delete root.dataset.theme;
}

function subscribe(onChange: () => void) {
  // Another tab changed the theme: follow it.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(event.newValue === 'light' ? 'light' : 'dark');
    onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

/**
 * Dark is the default; light sets `data-theme="light"` on <html> (tokens in
 * styles/index.css). The choice is saved in localStorage and shared by every
 * component that calls this hook.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, (): Theme => 'dark');

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode / storage disabled: the theme still applies for this visit.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(readTheme() === 'light' ? 'dark' : 'light'),
    [setTheme],
  );

  return { theme, setTheme, toggleTheme };
}
