import { createContext } from 'react';

/** Auto-hide delay. Keep in sync with `--toast-auto-hide` in src/styles/index.css. */
export const TOAST_DURATION_MS = 4500;
/** Older toasts are dropped when more than this many are on screen. */
export const TOAST_LIMIT = 3;

export type ToastVariant = 'success' | 'error' | 'info';

export type ToastAction = {
  /** Button text, e.g. "تراجع" (Undo). */
  label: string;
  /** Runs on click; the toast closes right after. */
  onClick: () => void;
};

export type ToastOptions = {
  description?: string;
  action?: ToastAction;
};

export type ToastItem = ToastOptions & {
  id: number;
  variant: ToastVariant;
  title: string;
};

export type ToastApi = {
  show: (toast: Omit<ToastItem, 'id'>) => number;
  success: (title: string, options?: ToastOptions) => number;
  error: (title: string, options?: ToastOptions) => number;
  info: (title: string, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
};

export const ToastContext = createContext<ToastApi | null>(null);
