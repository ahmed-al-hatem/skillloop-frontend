import { useId, useState, type ReactNode } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/shared/lib/cn';
import { ConfirmReasonField } from './ConfirmReasonField';
import { ConfirmWarningIcon } from './ConfirmWarningIcon';
import { ConfirmWordField } from './ConfirmWordField';
import {
  buildConfirmSchema,
  DEFAULT_REASON_MAX,
  DEFAULT_REASON_MIN,
  type ConfirmFormValues,
  type ConfirmReasonOptions,
} from './confirmDialogSchema';

export type ConfirmDialogPayload = {
  /** The trimmed reason, when the dialog asks for one. */
  reason?: string;
};

export type ConfirmDialogFormProps = {
  risk: 'medium' | 'high';
  /** What happens, in a tinted callout (e.g. "<b>لا يمكن التراجع.</b> تختفي الخدمة…"). */
  effect?: ReactNode;
  /** Ask for a required reason (with min/max and a counter). It is passed to `onConfirm`. */
  reason?: ConfirmReasonOptions;
  /** Word the user must type to enable confirm, e.g. "أرشفة" or the member's name. */
  confirmWord?: string;
  /** Text before the word. Defaults to "للتأكيد اكتب كلمة". */
  confirmWordLabel?: ReactNode;
  /** Label of a checkbox the user must tick, e.g. "أفهم أن هذا القرار نهائي…". */
  acknowledge?: ReactNode;
  confirmLabel: ReactNode;
  /** Shown on the confirm button while pending, e.g. "جارٍ الأرشفة…". */
  pendingLabel?: ReactNode;
  cancelLabel: ReactNode;
  confirmVariant: 'primary' | 'destructive';
  isPending: boolean;
  /** Disables confirm and shows this text, e.g. "لا يمكن الأرشفة دون اتصال بالإنترنت." */
  disabledReason?: ReactNode;
  onCancel: () => void;
  onConfirm: (payload: ConfirmDialogPayload) => Promise<unknown> | void;
};

/** The body of `ConfirmDialog`. Mounted each time the dialog opens, so it starts empty. */
export function ConfirmDialogForm({
  risk,
  effect,
  reason,
  confirmWord,
  confirmWordLabel,
  acknowledge,
  confirmLabel,
  pendingLabel,
  cancelLabel,
  confirmVariant,
  isPending: pending,
  disabledReason,
  onCancel,
  onConfirm,
}: ConfirmDialogFormProps) {
  const id = useId();
  const reasonMin = reason?.min ?? DEFAULT_REASON_MIN;
  const reasonMax = reason?.max ?? DEFAULT_REASON_MAX;
  const [schema] = useState(() =>
    buildConfirmSchema({ reason, confirmWord, acknowledge: Boolean(acknowledge) }),
  );
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ConfirmFormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { reason: '', confirmWord: '', acknowledged: false },
  });
  const [reasonValue, wordValue] = useWatch({ control, name: ['reason', 'confirmWord'] });
  const blockedId = `${id}-blocked`;

  const submit = handleSubmit(async (values) => {
    try {
      await onConfirm(reason ? { reason: values.reason.trim() } : {});
    } catch {
      // The caller shows the error (toast); the dialog stays open so the user can retry.
    }
  });

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-4">
      {effect && (
        <div
          className={cn(
            'flex items-start gap-2.5 rounded-xl border p-3 text-[13px] leading-[1.8]',
            risk === 'high'
              ? 'border-danger/40 bg-danger-muted text-danger'
              : 'border-warning/40 bg-warning-muted text-warning',
          )}
        >
          <ConfirmWarningIcon className="mt-[3px] size-[18px]" />
          <div>{effect}</div>
        </div>
      )}
      {reason && (
        <ConfirmReasonField
          {...register('reason')}
          id={`${id}-reason`}
          label={reason.label}
          note={reason.note}
          placeholder={reason.placeholder}
          min={reasonMin}
          max={reasonMax}
          length={reasonValue.trim().length}
          error={errors.reason?.message}
          disabled={pending}
        />
      )}
      {confirmWord && (
        <ConfirmWordField
          id={`${id}-word`}
          word={confirmWord}
          label={confirmWordLabel}
          matches={wordValue.trim() === confirmWord}
          disabled={pending}
          {...register('confirmWord')}
        />
      )}
      {acknowledge && (
        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-background p-3 text-[13px] leading-[1.7] has-checked:border-primary has-checked:bg-accent">
          <input
            type="checkbox"
            disabled={pending}
            className="mt-[3px] size-[18px] shrink-0 accent-primary"
            {...register('acknowledged')}
          />
          <span>{acknowledge}</span>
        </label>
      )}
      {disabledReason && (
        <p id={blockedId} className="text-xs text-warning">
          {disabledReason}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2.5">
        <Button variant="outline" onClick={onCancel} disabled={pending} className="h-11">
          {cancelLabel}
        </Button>
        <Button
          type="submit"
          variant={confirmVariant}
          isLoading={pending}
          disabled={!isValid || Boolean(disabledReason)}
          aria-describedby={disabledReason ? blockedId : undefined}
          className="h-11 font-bold"
        >
          {pending && pendingLabel ? pendingLabel : confirmLabel}
        </Button>
      </div>
    </form>
  );
}
