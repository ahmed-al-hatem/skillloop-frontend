import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
} from 'react';
import { cn } from '@/shared/lib/cn';

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
} as const;

const iconTones = {
  primary: 'bg-accent text-primary',
  danger: 'bg-danger-muted text-danger',
  warning: 'bg-warning-muted text-warning',
  info: 'bg-info-muted text-info',
  success: 'bg-success-muted text-success',
} as const;

export type DialogProps = {
  open: boolean;
  /** Called with `false` when the user asks to close (Esc, backdrop click). */
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Optional icon shown in a tinted tile before the title. */
  icon?: ReactNode;
  iconTone?: keyof typeof iconTones;
  /** Action buttons, laid out at the end of the dialog. */
  footer?: ReactNode;
  children?: ReactNode;
  size?: keyof typeof sizes;
  /** `false` ignores Esc and backdrop clicks — e.g. while a mutation is pending. */
  dismissible?: boolean;
  closeOnBackdropClick?: boolean;
  /** Element to focus on open. Defaults to the first focusable element. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  role?: 'dialog' | 'alertdialog';
  className?: string;
};

/**
 * Modal dialog on the native `<dialog>` element: `showModal()` gives the focus trap,
 * makes the page inert and puts it in the top layer. Controlled: render it with
 * `open` and close it from `onOpenChange`. Content is unmounted while closed.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  iconTone = 'primary',
  footer,
  children,
  size = 'md',
  dismissible = true,
  closeOnBackdropClick = true,
  initialFocusRef,
  role = 'dialog',
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressedOnBackdrop = useRef(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = document.documentElement;
    dialog.showModal();
    initialFocusRef?.current?.focus();
    root.classList.add('overflow-hidden');

    return () => {
      dialog.close();
      // Keep the page locked while another dialog is still open (nested dialogs).
      if (!document.querySelector('dialog[open]')) root.classList.remove('overflow-hidden');
      trigger?.focus();
    };
  }, [open, initialFocusRef]);

  function requestClose() {
    if (dismissible) onOpenChange(false);
  }

  // Handle Esc ourselves so the browser never closes the dialog behind React's back.
  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    requestClose();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    requestClose();
  }

  // If the browser still closed it (e.g. repeated Esc), re-sync with the `open` prop.
  function handleClose() {
    const dialog = dialogRef.current;
    // Already open again: a stale event from our own close() (StrictMode remount).
    if (!open || !dialog || dialog.open) return;
    if (dismissible) onOpenChange(false);
    else dialog.showModal();
  }

  // The <dialog> fills the viewport, so a click whose target is the dialog itself
  // landed outside the panel. Both press and release must be outside (no drag-out).
  function handleMouseDown(event: MouseEvent<HTMLDialogElement>) {
    pressedOnBackdrop.current = event.target === event.currentTarget;
  }

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    const outside = pressedOnBackdrop.current && event.target === event.currentTarget;
    pressedOnBackdrop.current = false;
    if (outside && closeOnBackdropClick) requestClose();
  }

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      role={role}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onKeyDown={handleKeyDown}
      onCancel={handleCancel}
      onClose={handleClose}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={cn(
        'fixed inset-0 m-0 grid size-full max-h-none max-w-none place-items-center overflow-y-auto bg-transparent p-4 text-foreground',
        'backdrop:bg-background/75 light:backdrop:bg-foreground/40',
      )}
    >
      <div
        className={cn(
          'flex w-full flex-col gap-4 rounded-[18px] bg-surface p-6 text-start shadow-2xl',
          'transition-[opacity,translate,scale] duration-modal ease-spring motion-reduce:transition-none',
          'starting:translate-y-2.5 starting:scale-96 starting:opacity-0',
          sizes[size],
          className,
        )}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span
              aria-hidden="true"
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-xl [&_svg]:size-[22px]',
                iconTones[iconTone],
              )}
            >
              {icon}
            </span>
          )}
          <h2 id={titleId} className="text-lg font-bold">
            {title}
          </h2>
        </div>
        {description && (
          <p id={descriptionId} className="text-sm leading-[1.8] text-foreground/85">
            {description}
          </p>
        )}
        {children}
        {footer && <div className="flex flex-wrap justify-end gap-2.5">{footer}</div>}
      </div>
    </dialog>
  );
}
