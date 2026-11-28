import { useId, type ReactNode, type RefObject } from 'react';
import { useModalDialog } from '@/shared/hooks/useModalDialog';
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
      role={role}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
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
