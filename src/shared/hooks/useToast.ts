import { useContext } from 'react';
import { ToastContext, type ToastApi } from '@/shared/lib/toast';

/**
 * Show a toast after a mutation:
 * `toast.success('تم حل النزاع')`, `toast.error('فشل الحفظ')`,
 * `toast.success('تم إخفاء التقييم', { action: { label: 'تراجع', onClick: undo } })`.
 */
export function useToast(): ToastApi {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error('useToast must be used inside <ToastProvider>.');
  return toast;
}
