import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { TOAST_LIMIT, ToastContext, type ToastApi, type ToastItem } from '@/shared/lib/toast';
import { ToastViewport } from './ui/ToastViewport';

export type ToastProviderProps = {
  children: ReactNode;
};

/** Holds the toast list and renders the stack. Mounted once in src/app/providers.tsx. */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const api = useMemo<ToastApi>(() => {
    const show: ToastApi['show'] = (toast) => {
      const id = ++nextId.current;
      setToasts((current) => [...current, { ...toast, id }].slice(-TOAST_LIMIT));
      return id;
    };
    return {
      show,
      success: (title, options) => show({ ...options, variant: 'success', title }),
      error: (title, options) => show({ ...options, variant: 'error', title }),
      info: (title, options) => show({ ...options, variant: 'info', title }),
      dismiss,
    };
  }, [dismiss]);

  return (
    <ToastContext value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext>
  );
}
