import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { bookingKeys } from '@/admin-features/bookings';
import { toApiError } from '@/shared/api/client';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { Ltr } from '@/shared/components/ui/Ltr';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useToast } from '@/shared/hooks/useToast';
import { memberKeys } from '../api/members.keys';
import { actionErrorMessage } from '../lib/actionErrorMessage';
import { useSuspendMember } from '../api/members.queries';
import { REASON_MAX, REASON_MIN } from '../schemas/member-forms.schema';
import type { AdminUserDetails } from '../schemas/member.schema';
import { DialogErrorBanner } from './DialogErrorBanner';
import { OngoingBookings } from './OngoingBookings';
import { SuspendIcon } from './SuspendIcon';

export type SuspendMemberDialogProps = {
  member: AdminUserDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * High-friction confirm (plan §1.2): required reason (kept in the member's record) and the
 * member's first name typed back. The effect follows the contract: logout everywhere, services
 * hidden, PENDING bookings cancelled with full refunds; other open bookings stay for the admin.
 */
export function SuspendMemberDialog({ member, open, onOpenChange }: SuspendMemberDialogProps) {
  const suspend = useSuspendMember(member.id);
  const queryClient = useQueryClient();
  const toast = useToast();
  const isOnline = useOnlineStatus();
  const [serverError, setServerError] = useState<string | null>(null);
  const firstName = member.fullName.trim().split(/\s+/)[0] ?? member.fullName;

  function changeOpen(next: boolean) {
    setServerError(null);
    onOpenChange(next);
  }

  async function confirm(reason: string) {
    setServerError(null);
    try {
      await suspend.mutateAsync({ reason });
      // PENDING bookings were cancelled: refresh the bookings tab and lists too.
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      toast.success(`تم إيقاف ${member.fullName}`, {
        description: 'سُجّل خروجه من كل الأجهزة، وأُخفيت خدماته، وأُلغيت حجوزاته المعلقة.',
      });
    } catch (err) {
      const error = toApiError(err);
      if (error.status === 409) {
        // Suspended meanwhile by someone else: close and show the fresh state.
        toast.error('العضو موقوف بالفعل', { description: error.message });
        void queryClient.invalidateQueries({ queryKey: memberKeys.detail(member.id) });
        return;
      }
      // Rejecting keeps the dialog open with the reason, so the admin can fix it and retry.
      setServerError(actionErrorMessage(error, 'تعذّر إيقاف العضو.', 'reason'));
      throw error;
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={changeOpen}
      risk="high"
      title={
        <>
          إيقاف <bdi>{member.fullName}</bdi>
        </>
      }
      icon={<SuspendIcon className="size-5.5" />}
      description={serverError ? <DialogErrorBanner message={serverError} /> : undefined}
      effect={
        <div className="flex flex-col gap-3">
          <div>
            <b>ماذا سيحدث فوراً:</b>
            <ul className="list-disc ps-5">
              <li>تسجيل خروج العضو من كل الأجهزة</li>
              {member.activeServicesCount > 0 && (
                <li>
                  إخفاء خدماته النشطة <Ltr>({member.activeServicesCount})</Ltr> من السوق
                </li>
              )}
              <li>إلغاء حجوزاته المعلقة واسترداد نقاطها كاملة للأطراف</li>
            </ul>
          </div>
          <OngoingBookings memberId={member.id} />
        </div>
      }
      reason={{
        label: 'سبب الإيقاف',
        placeholder: 'اكتب سبباً واضحاً يُحفظ في سجل العضو',
        min: REASON_MIN,
        max: REASON_MAX,
      }}
      confirmWord={firstName}
      confirmWordLabel="للتأكيد اكتب اسم العضو"
      confirmLabel="إيقاف العضو"
      pendingLabel="جارٍ الإيقاف…"
      disabledReason={isOnline ? undefined : 'لا يمكن إيقاف العضو دون اتصال بالإنترنت.'}
      isPending={suspend.isPending}
      onConfirm={({ reason = '' }) => confirm(reason)}
    />
  );
}
