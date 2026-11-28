import { useQueryClient } from '@tanstack/react-query';
import { toApiError } from '@/shared/api/client';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useToast } from '@/shared/hooks/useToast';
import { useArchiveService } from '../api/services.queries';
import { serviceKeys } from '../api/services.keys';
import { ARCHIVE_REASON_MAX, ARCHIVE_REASON_MIN, type Service } from '../schemas/service.schema';
import { ArchiveIcon } from './ArchiveIcon';

export type ArchiveServiceDialogProps = {
  /** The service being archived. Kept while the dialog closes so its title does not flash. */
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * High-friction confirm (plan §1.2): required reason (sent to the provider) + typed word «أرشفة».
 * Final: the service leaves the market; running bookings continue.
 */
export function ArchiveServiceDialog({ service, open, onOpenChange }: ArchiveServiceDialogProps) {
  const archive = useArchiveService(service?.id ?? '');
  const queryClient = useQueryClient();
  const toast = useToast();
  const isOnline = useOnlineStatus();
  const title = service?.title ?? '';

  async function confirm(reason: string) {
    try {
      await archive.mutateAsync({ reason });
      toast.success('تمت أرشفة الخدمة', {
        description: `«${title}» لم تعد ظاهرة في السوق، وأُبلغ مقدمها بالسبب.`,
      });
    } catch (err) {
      const error = toApiError(err);
      if (error.status === 409) {
        // Someone archived it meanwhile: nothing left to do here, so close and refresh the list.
        toast.error('الخدمة مؤرشفة بالفعل', { description: error.message });
        void queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
        return;
      }
      // Rejecting keeps the dialog open with the reason, so the admin can fix it and retry.
      toast.error('تعذّرت أرشفة الخدمة', {
        description: error.fieldErrors.reason ?? error.message,
      });
      throw error;
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      risk="high"
      title={
        <>
          أرشفة «<bdi>{title}</bdi>»
        </>
      }
      icon={<ArchiveIcon className="size-5.5" />}
      effect={
        <>
          <b>لا يمكن التراجع.</b> تختفي الخدمة من السوق ولا تقبل حجوزات جديدة. الحجوزات الجارية تكمل
          مسارها.
        </>
      }
      reason={{
        label: 'سبب الأرشفة',
        note: '(يُرسل لمقدم الخدمة)',
        placeholder: 'مثال: الخدمة تخالف شروط المنصة لأنها…',
        min: ARCHIVE_REASON_MIN,
        max: ARCHIVE_REASON_MAX,
      }}
      confirmWord="أرشفة"
      confirmLabel="أرشفة نهائية"
      pendingLabel="جارٍ الأرشفة…"
      disabledReason={isOnline ? undefined : 'لا يمكن الأرشفة دون اتصال بالإنترنت.'}
      isPending={archive.isPending}
      onConfirm={({ reason = '' }) => confirm(reason)}
    />
  );
}
