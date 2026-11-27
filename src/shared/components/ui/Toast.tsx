import { useEffect, useRef, useState, type FocusEvent } from 'react';
import { cn } from '@/shared/lib/cn';
import { TOAST_DURATION_MS, type ToastItem, type ToastVariant } from '@/shared/lib/toast';
import { Button } from './Button';

const styles: Record<ToastVariant, { card: string; icon: string; bar: string; path: string }> = {
  success: {
    card: 'border-border',
    icon: 'bg-secondary text-secondary-foreground',
    bar: 'bg-secondary',
    path: 'm5 12 5 5 9-10',
  },
  error: {
    card: 'border-danger/40',
    icon: 'bg-destructive text-destructive-foreground',
    bar: 'bg-destructive',
    path: 'M12 7v6M12 17h.01',
  },
  info: {
    card: 'border-border',
    icon: 'bg-info text-info-foreground',
    bar: 'bg-info',
    path: 'M12 11v6M12 7h.01',
  },
};

export type ToastProps = {
  toast: ToastItem;
  onDismiss: (id: number) => void;
};

/**
 * One toast card. Hides itself after 4.5 s; the timer (and the duration bar) pause while
 * the pointer is over it or focus is inside it. Rendered by ToastViewport — use `useToast()`.
 */
export function Toast({ toast, onDismiss }: ToastProps) {
  const { id, variant, title, description, action } = toast;
  const [isPaused, setIsPaused] = useState(false);
  const isHovered = useRef(false);
  const isFocused = useRef(false);
  const remaining = useRef(TOAST_DURATION_MS);

  useEffect(() => {
    if (isPaused) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => onDismiss(id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [isPaused, id, onDismiss]);

  const syncPause = () => setIsPaused(isHovered.current || isFocused.current);

  const handleBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    isFocused.current = false;
    syncPause();
  };

  const style = styles[variant];

  return (
    <li
      className={cn(
        'pointer-events-auto relative flex items-center gap-3 overflow-hidden rounded-xl border bg-surface px-4 py-3.5 text-foreground shadow-lg',
        'animate-toast-in motion-reduce:animate-none',
        style.card,
      )}
      onMouseEnter={() => {
        isHovered.current = true;
        syncPause();
      }}
      onMouseLeave={() => {
        isHovered.current = false;
        syncPause();
      }}
      onFocus={() => {
        isFocused.current = true;
        syncPause();
      }}
      onBlur={handleBlur}
    >
      <span
        className={cn('flex size-7 flex-none items-center justify-center rounded-full', style.icon)}
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={style.path} />
        </svg>
      </span>

      <div className="min-w-0 flex-1 text-sm">
        <p className="font-medium">{title}</p>
        {description && <p className="mt-0.5 text-muted-foreground">{description}</p>}
      </div>

      {action && (
        <Button
          variant="ghost"
          size="sm"
          className="flex-none font-semibold"
          onClick={() => {
            action.onClick();
            onDismiss(id);
          }}
        >
          {action.label}
        </Button>
      )}

      <button
        type="button"
        aria-label="إغلاق"
        className="-my-2 -me-2 flex size-11 flex-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        onClick={() => onDismiss(id)}
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <span
        aria-hidden="true"
        className={cn(
          'absolute start-0 bottom-0 h-1 animate-toast-progress motion-reduce:hidden',
          isPaused && '[animation-play-state:paused]',
          style.bar,
        )}
      />
    </li>
  );
}
