import {
  useEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  type SyntheticEvent,
} from 'react';

export type UseModalDialogOptions = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `false` ignores Esc and backdrop clicks — e.g. while a mutation is pending. */
  dismissible?: boolean;
  closeOnBackdropClick?: boolean;
  /** Element to focus on open. Defaults to the first focusable element. */
  initialFocusRef?: RefObject<HTMLElement | null>;
};

/**
 * The shared behaviour of `Dialog` and `Drawer` on a native `<dialog>`: `showModal()` gives
 * the focus trap, makes the page inert and puts it in the top layer. Locks page scroll,
 * restores focus to the trigger on close, and routes Esc / backdrop clicks to `onOpenChange`.
 * Spread the returned props on a `<dialog>` that fills the viewport.
 */
export function useModalDialog({
  open,
  onOpenChange,
  dismissible = true,
  closeOnBackdropClick = true,
  initialFocusRef,
}: UseModalDialogOptions) {
  const ref = useRef<HTMLDialogElement>(null);
  const pressedOnBackdrop = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
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
  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    requestClose();
  }

  function onCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    requestClose();
  }

  // If the browser still closed it (e.g. repeated Esc), re-sync with the `open` prop.
  function onClose() {
    const dialog = ref.current;
    // Already open again: a stale event from our own close() (StrictMode remount).
    if (!open || !dialog || dialog.open) return;
    if (dismissible) onOpenChange(false);
    else dialog.showModal();
  }

  // The <dialog> fills the viewport, so a click whose target is the dialog itself
  // landed outside the panel. Both press and release must be outside (no drag-out).
  function onMouseDown(event: MouseEvent<HTMLDialogElement>) {
    pressedOnBackdrop.current = event.target === event.currentTarget;
  }

  function onClick(event: MouseEvent<HTMLDialogElement>) {
    const outside = pressedOnBackdrop.current && event.target === event.currentTarget;
    pressedOnBackdrop.current = false;
    if (outside && closeOnBackdropClick) requestClose();
  }

  return { ref, onKeyDown, onCancel, onClose, onMouseDown, onClick };
}
