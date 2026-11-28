import type { ToastItem } from '@/shared/lib/toast';
import { Toast } from './Toast';

export type ToastViewportProps = {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
};

function announcement(toast: ToastItem | undefined) {
  if (!toast) return null;
  // A new key re-inserts the text, so the same message is announced again.
  return <p key={toast.id}>{[toast.title, toast.description].filter(Boolean).join('. ')}</p>;
}

/**
 * Toast stack, bottom-start (bottom-right in RTL), newest at the bottom.
 * Screen readers hear success/info politely and errors assertively.
 */
export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  const lastPolite = toasts.findLast((toast) => toast.variant !== 'error');
  const lastError = toasts.findLast((toast) => toast.variant === 'error');

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement(lastPolite)}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcement(lastError)}
      </div>
      <ol
        aria-label="الإشعارات"
        className="pointer-events-none fixed start-4 end-4 bottom-4 z-50 flex flex-col gap-3 sm:end-auto sm:w-96"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </ol>
    </>
  );
}
