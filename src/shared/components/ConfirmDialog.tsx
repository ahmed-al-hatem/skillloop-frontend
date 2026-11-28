import { useState, type ReactNode } from 'react';
import { AlertDialog } from '@/shared/components/ui/AlertDialog';
import type { DialogProps } from '@/shared/components/ui/Dialog';
import { ConfirmDialogForm, type ConfirmDialogFormProps } from './ConfirmDialogForm';
import { ConfirmWarningIcon } from './ConfirmWarningIcon';

export type { ConfirmDialogPayload } from './ConfirmDialogForm';
export type { ConfirmReasonOptions } from './confirmDialogSchema';

export type ConfirmDialogProps = Omit<
  ConfirmDialogFormProps,
  'cancelLabel' | 'confirmVariant' | 'isPending' | 'onCancel'
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * `medium`: a warning that explains the effect. `high`: danger tone and a destructive button;
   * pair it with `reason` plus `confirmWord` or `acknowledge` (plan §1.2 "friction by risk").
   */
  risk: 'medium' | 'high';
  title: ReactNode;
  description?: ReactNode;
  /** Defaults to "إلغاء". */
  cancelLabel?: ReactNode;
  /** Defaults to `destructive` for high risk, `primary` for medium. */
  confirmVariant?: ConfirmDialogFormProps['confirmVariant'];
  /** Defaults to a warning triangle. */
  icon?: ReactNode;
  /** Defaults to `danger` for high risk, `warning` for medium. */
  iconTone?: DialogProps['iconTone'];
  /** E.g. `mutation.isPending`. Also pending while `onConfirm`'s promise runs. */
  isPending?: boolean;
};

/**
 * Confirmation for risky actions, on `AlertDialog` (Esc closes, backdrop does not).
 * Confirm stays disabled until every shown field is valid; errors appear after blur or edit.
 * While pending, the dialog stays open with a spinner (Esc, cancel and fields are blocked).
 * When `onConfirm` resolves the dialog closes; when it rejects it stays open for a retry.
 *
 * ```tsx
 * <ConfirmDialog open={open} onOpenChange={setOpen} risk="high" title="أرشفة «تصميم شعار»"
 *   effect={<><b>لا يمكن التراجع.</b> تختفي الخدمة من السوق.</>}
 *   reason={{ label: 'سبب الأرشفة', min: 10 }} confirmWord="أرشفة"
 *   confirmLabel="أرشفة نهائية" pendingLabel="جارٍ الأرشفة…" disabledReason={offline ? '…' : undefined}
 *   onConfirm={({ reason }) => archive.mutateAsync({ id, reason })} />
 * ```
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  risk,
  title,
  description,
  icon = <ConfirmWarningIcon />,
  iconTone,
  confirmVariant,
  cancelLabel = 'إلغاء',
  isPending = false,
  onConfirm,
  ...formProps
}: ConfirmDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const pending = isPending || submitting;
  const close = () => onOpenChange(false);

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      icon={icon}
      iconTone={iconTone ?? (risk === 'high' ? 'danger' : 'warning')}
      size={risk === 'high' ? 'lg' : 'md'}
      dismissible={!pending}
    >
      <ConfirmDialogForm
        {...formProps}
        risk={risk}
        cancelLabel={cancelLabel}
        confirmVariant={confirmVariant ?? (risk === 'high' ? 'destructive' : 'primary')}
        isPending={pending}
        onCancel={close}
        onConfirm={async (payload) => {
          setSubmitting(true);
          try {
            await onConfirm(payload);
            close();
          } finally {
            setSubmitting(false);
          }
        }}
      />
    </AlertDialog>
  );
}
