import { Dialog, type DialogProps } from './Dialog';

export type AlertDialogProps = Omit<DialogProps, 'role' | 'closeOnBackdropClick'>;

/**
 * Dialog that asks the user to confirm or cancel an action (`role="alertdialog"`).
 * Esc still closes it, but a backdrop click does not — the user must pick a button.
 * Pass `initialFocusRef` to the cancel button so Enter never confirms by accident.
 */
export function AlertDialog(props: AlertDialogProps) {
  return <Dialog {...props} role="alertdialog" closeOnBackdropClick={false} />;
}
