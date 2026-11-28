import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toApiError } from '@/shared/api/client';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';
import { useToast } from '@/shared/hooks/useToast';
import { memberKeys } from '../api/members.keys';
import { actionErrorMessage } from '../lib/actionErrorMessage';
import { useUnsuspendMember } from '../api/members.queries';
import type { AdminUserDetails } from '../schemas/member.schema';
import { DialogErrorBanner } from './DialogErrorBanner';

export type UnsuspendMemberDialogProps = {
  member: AdminUserDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Medium-friction confirm (plan §1.2): explains the effect, no reason needed. */
export function UnsuspendMemberDialog({ member, open, onOpenChange }: UnsuspendMemberDialogProps) {
  const unsuspend = useUnsuspendMember(member.id);
  const queryClient = useQueryClient();
  const toast = useToast();
  const isOnline = useOnlineStatus();
  const [serverError, setServerError] = useState<string | null>(null);

  function changeOpen(next: boolean) {
    setServerError(null);
    onOpenChange(next);
  }

  async function confirm() {
    setServerError(null);
    try {
      await unsuspend.mutateAsync();
      toast.success(`تم رفع الإيقاف عن ${member.fullName}`, {
        description: 'يمكنه تسجيل الدخول الآن، وعادت خدماته للظهور.',
      });
    } catch (err) {
      const error = toApiError(err);
      if (error.status === 409) {
        toast.error('العضو غير موقوف', { description: error.message });
        void queryClient.invalidateQueries({ queryKey: memberKeys.detail(member.id) });
        return;
      }
      setServerError(actionErrorMessage(error, 'تعذّر رفع الإيقاف.'));
      throw error;
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={changeOpen}
      risk="medium"
      title={
        <>
          رفع الإيقاف عن <bdi>{member.fullName}</bdi>؟
        </>
      }
      description={
        <>
          سيتمكن من تسجيل الدخول مجدداً، وتعود خدماته للظهور. الحجوزات الملغاة لا تُستعاد.
          <DialogErrorBanner message={serverError} />
        </>
      }
      confirmLabel="رفع الإيقاف"
      pendingLabel="جارٍ رفع الإيقاف…"
      disabledReason={isOnline ? undefined : 'لا يمكن رفع الإيقاف دون اتصال بالإنترنت.'}
      isPending={unsuspend.isPending}
      onConfirm={() => confirm()}
    />
  );
}
