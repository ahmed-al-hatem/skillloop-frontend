import { useState } from 'react';
import { Controller, useForm, useWatch, type UseFormSetError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toApiError, type ApiRequestError } from '@/shared/api/client';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Button } from '@/shared/components/ui/Button';
import { CharCounter } from '@/shared/components/ui/CharCounter';
import { Ltr } from '@/shared/components/ui/Ltr';
import { PointsAmount } from '@/shared/components/ui/PointsAmount';
import { RadioCardGroup } from '@/shared/components/ui/RadioCardGroup';
import { Slider } from '@/shared/components/ui/Slider';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { Textarea } from '@/shared/components/ui/Textarea';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useToast } from '@/shared/hooks/useToast';
import { cn } from '@/shared/lib/cn';
import { useResolveDispute } from '../api/disputes.queries';
import {
  ADMIN_NOTE_MAX,
  ADMIN_NOTE_MIN,
  RESOLVE_DECISION_OPTIONS,
  RESOLVE_GATE_TEXT,
} from '../constants';
import { formatEntityRef } from '../lib/entityRef';
import { previewSplit } from '../lib/resolvePreview';
import type { AdminDispute, DisputeDecision } from '../schemas/dispute.schema';
import {
  receiverPercentOf,
  ResolveFormSchema,
  toResolveRequest,
  type ResolveDisputeRequest,
  type ResolveFormInput,
  type ResolveFormValues,
} from '../schemas/resolve-form.schema';
import { ResolvePreview } from './ResolvePreview';

export type ResolveFormProps = {
  dispute: AdminDispute;
  /** From `isResolveLocked`: the provider can still reply, so the backend would answer 409. */
  locked: boolean;
};

const NOTE_ID = 'resolve-note';
const NOTE_COUNT_ID = 'resolve-note-count';

/** The admin's final decision: who gets the held points, and a note both sides will see. */
export function ResolveForm({ dispute, locked }: ResolveFormProps) {
  const isOnline = useOnlineStatus();
  const toast = useToast();
  const resolve = useResolveDispute();
  const [request, setRequest] = useState<ResolveDisputeRequest | null>(null);
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<ResolveFormInput, unknown, ResolveFormValues>({
    resolver: zodResolver(ResolveFormSchema),
    mode: 'onTouched',
    defaultValues: { decision: undefined, splitPercent: 50, adminNote: '' },
  });
  const [decision, splitPercent, adminNote] = useWatch({
    control,
    name: ['decision', 'splitPercent', 'adminNote'],
  });
  const receiverPercent = decision ? receiverPercentOf(decision, splitPercent) : undefined;
  const ref = formatEntityRef(dispute);
  const offline = !isOnline;
  const canSubmit = isValid && !locked && !offline;
  const gate = locked ? 'locked' : offline ? 'offline' : isValid ? 'ready' : 'incomplete';

  const confirm = async () => {
    if (!request) return;
    try {
      await resolve.mutateAsync({ id: dispute.id, body: request });
      toast.success('تم حل النزاع', {
        description: 'حُوّلت النقاط وأُبلغ الطرفان بالقرار.',
      });
    } catch (error) {
      const apiError = toApiError(error);
      // Network or server failure: keep the dialog open so the admin can retry.
      if (apiError.status === 0 || apiError.status >= 500) {
        toast.error('تعذّر حل النزاع', { description: apiError.message });
        throw error;
      }
      // 400 / 409 / 422: back to the form, fields first, else a banner.
      setRequest(null);
      if (!applyServerErrors(apiError, setError, request.decision)) {
        setError('root.server', { message: apiError.message });
      }
    }
  };

  const split = request ? previewSplit(dispute.booking.pricePoints, request.receiverPercent) : null;

  return (
    <section
      aria-labelledby="resolve-title"
      className="flex flex-col gap-5 rounded-2xl border-2 border-border bg-surface p-5 md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="resolve-title" className="text-lg font-bold">
          قرار الحل
        </h2>
        <StatusBadge variant="danger">القرار نهائي ولا يمكن التراجع عنه</StatusBadge>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit((values) => setRequest(toResolveRequest(values)))}
        className="flex flex-col gap-5"
      >
        <Controller
          control={control}
          name="decision"
          render={({ field }) => (
            <RadioCardGroup<DisputeDecision>
              name={field.name}
              legend="لمن تذهب النقاط المحجوزة؟"
              options={Object.entries(RESOLVE_DECISION_OPTIONS).map(([value, option]) => ({
                value: value as DisputeDecision,
                label: option.label,
                description: option.description(
                  dispute.receiver.fullName,
                  dispute.provider.fullName,
                ),
              }))}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              error={errors.decision?.message}
            />
          )}
        />

        {decision === 'SPLIT' && (
          <Controller
            control={control}
            name="splitPercent"
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <Slider
                  label="نسبة المستلم:"
                  min={1}
                  max={99}
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  formatValue={(value) => `${value}%`}
                />
                {errors.splitPercent && (
                  <p className="text-sm text-danger">{errors.splitPercent.message}</p>
                )}
              </div>
            )}
          />
        )}

        <ResolvePreview dispute={dispute} receiverPercent={receiverPercent} />

        <div className="flex flex-col gap-2">
          <label htmlFor={NOTE_ID} className="text-sm font-semibold">
            ملاحظة الأدمن
          </label>
          <p className="rounded-lg bg-info-muted px-3 py-2 text-xs text-info">
            هذه الملاحظة مرئية للطرفين. اكتب سبب القرار بوضوح ولغة محايدة.
          </p>
          <Textarea
            id={NOTE_ID}
            maxLength={ADMIN_NOTE_MAX}
            placeholder="مثال: تبيّن أن 5 صفحات من أصل 12 لم تُسلَّم، لذلك…"
            invalid={Boolean(errors.adminNote)}
            aria-describedby={NOTE_COUNT_ID}
            {...register('adminNote')}
          />
          <CharCounter
            id={NOTE_COUNT_ID}
            length={adminNote.trim().length}
            min={ADMIN_NOTE_MIN}
            max={ADMIN_NOTE_MAX}
            hint={`من ${ADMIN_NOTE_MIN} إلى ${ADMIN_NOTE_MAX} حرف`}
            error={errors.adminNote?.message}
          />
        </div>

        {errors.root?.server && (
          <p role="alert" className="rounded-lg bg-danger-muted px-3 py-2 text-sm text-danger">
            {errors.root.server.message}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p
            id="resolve-gate"
            className={cn(
              'text-sm',
              gate === 'ready' && 'text-success',
              gate === 'offline' && 'text-warning',
              (gate === 'locked' || gate === 'incomplete') && 'text-muted-foreground',
            )}
          >
            {RESOLVE_GATE_TEXT[gate]}
          </p>
          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit}
            aria-describedby="resolve-gate"
            className="rounded-xl px-7 text-base font-bold"
          >
            حل النزاع
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={request !== null}
        onOpenChange={(open) => {
          if (!open) setRequest(null);
        }}
        risk="high"
        iconTone="warning"
        confirmVariant="primary"
        title={
          <>
            تأكيد حل النزاع <Ltr>{ref}</Ltr>
          </>
        }
        description={
          split && (
            <>
              معاينة: المستلم يحصل على <PointsAmount value={split.receiver} /> ومقدم الخدمة على{' '}
              <PointsAmount value={split.provider} />.
            </>
          )
        }
        acknowledge={
          <>
            أفهم أن هذا القرار <b className="text-danger">نهائي ولا يمكن التراجع عنه</b>، وأن
            ملاحظتي ستظهر للطرفين.
          </>
        }
        cancelLabel="رجوع"
        confirmLabel="تأكيد الحل النهائي"
        pendingLabel="جارٍ التنفيذ…"
        isPending={resolve.isPending}
        disabledReason={offline ? RESOLVE_GATE_TEXT.offline : undefined}
        onConfirm={confirm}
      />
    </section>
  );
}

/** Puts the backend's `details[]` on the form fields. Returns false when none matched. */
function applyServerErrors(
  error: ApiRequestError,
  setError: UseFormSetError<ResolveFormInput>,
  decision: DisputeDecision,
): boolean {
  let applied = false;
  for (const [field, message] of Object.entries(error.fieldErrors)) {
    const target =
      field === 'adminNote' || field === 'decision'
        ? field
        : field === 'receiverPercent'
          ? decision === 'SPLIT'
            ? 'splitPercent'
            : 'decision'
          : null;
    if (target) {
      setError(target, { message }, { shouldFocus: !applied });
      applied = true;
    }
  }
  return applied;
}
