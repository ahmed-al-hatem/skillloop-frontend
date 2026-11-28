import { useId, type ReactNode, type RefObject } from 'react';
import { useModalDialog } from '@/shared/hooks/useModalDialog';
import { cn } from '@/shared/lib/cn';

const sizes = {
  sm: 'w-[380px]',
  md: 'w-[460px]',
  lg: 'w-[560px]',
} as const;

export type DrawerProps = {
  open: boolean;
  /** Called with `false` when the user asks to close (Esc, backdrop click, close button). */
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Sticky bar under the body. Laid out at the end; give a summary `me-auto` to keep it at the start. */
  footer?: ReactNode;
  /** The scrollable body. */
  children?: ReactNode;
  size?: keyof typeof sizes;
  /** `false` ignores Esc, backdrop clicks and hides the close button — e.g. while saving. */
  dismissible?: boolean;
  closeOnBackdropClick?: boolean;
  /** Element to focus on open. Defaults to the first focusable element (the close button). */
  initialFocusRef?: RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * Side sheet (categories edit, booking detail) that slides in from the **end** side — the
 * left in RTL. Built on the same native `<dialog>` behaviour as `Dialog`: focus trap, Esc,
 * restored focus, `aria-modal`. Controlled; content is unmounted while closed.
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  size = 'md',
  dismissible = true,
  closeOnBackdropClick = true,
  initialFocusRef,
  className,
}: DrawerProps) {
  const dialogProps = useModalDialog({
    open,
    onOpenChange,
    dismissible,
    closeOnBackdropClick,
    initialFocusRef,
  });
  const titleId = useId();
  const descriptionId = useId();

  if (!open) return null;

  return (
    <dialog
      {...dialogProps}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        'fixed inset-0 m-0 flex size-full max-h-none max-w-none justify-end overflow-hidden bg-transparent text-foreground',
        'backdrop:bg-background/65 light:backdrop:bg-foreground/40',
        'backdrop:transition-opacity backdrop:duration-modal backdrop:starting:opacity-0',
      )}
    >
      <div
        className={cn(
          'flex h-full max-w-full flex-col border-s border-border bg-surface text-start shadow-2xl',
          'transition-[translate] duration-drawer ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none',
          // `justify-end` puts the panel on the end side; it slides in from beyond that edge.
          'starting:translate-x-full rtl:starting:-translate-x-full',
          sizes[size],
          className,
        )}
      >
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2 id={titleId} className="text-lg font-bold">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {dismissible && (
            <button
              type="button"
              aria-label="إغلاق"
              onClick={() => onOpenChange(false)}
              className="flex size-9 flex-none items-center justify-center rounded-[9px] bg-muted text-foreground transition-colors hover:bg-accent"
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
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-border px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}
