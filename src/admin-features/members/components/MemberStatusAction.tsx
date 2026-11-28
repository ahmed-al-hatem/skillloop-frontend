import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import type { AdminUserDetails } from '../schemas/member.schema';
import { SuspendIcon } from './SuspendIcon';
import { SuspendMemberDialog } from './SuspendMemberDialog';
import { UnsuspendMemberDialog } from './UnsuspendMemberDialog';

type OpenDialog = 'suspend' | 'unsuspend' | null;

export type MemberStatusActionProps = { member: AdminUserDetails };

/**
 * Header button «إيقاف العضو» or «رفع الإيقاف», with its confirm dialog. Both dialogs stay
 * mounted: the member refetches (new status) before the dialog closes, and the open one must
 * not swap for the other.
 */
export function MemberStatusAction({ member }: MemberStatusActionProps) {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const suspended = member.status === 'SUSPENDED';
  const openChange = (which: Exclude<OpenDialog, null>) => (open: boolean) =>
    setDialog(open ? which : null);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setDialog(suspended ? 'unsuspend' : 'suspend')}
        className={
          suspended
            ? 'h-11 rounded-[10px] bg-surface font-semibold'
            : 'h-11 rounded-[10px] border-danger/50 bg-surface font-semibold text-danger hover:bg-danger-muted hover:text-danger'
        }
      >
        {!suspended && <SuspendIcon />}
        {suspended ? 'رفع الإيقاف' : 'إيقاف العضو'}
      </Button>
      <SuspendMemberDialog
        member={member}
        open={dialog === 'suspend'}
        onOpenChange={openChange('suspend')}
      />
      <UnsuspendMemberDialog
        member={member}
        open={dialog === 'unsuspend'}
        onOpenChange={openChange('unsuspend')}
      />
    </>
  );
}
