import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useLogout } from '@/features/auth';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { ROUTES } from '@/shared/constants/routes';
import { LogoutIcon } from './LogoutIcon';

export type LogoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Medium-friction confirm (plan §1.2). Drops every admin query, logs out, then goes to login. */
export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const queryClient = useQueryClient();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      risk="medium"
      title="تسجيل الخروج؟"
      description="ستحتاج إلى تسجيل الدخول مجدداً للوصول إلى لوحة الإدارة. أي تغييرات غير محفوظة ستضيع."
      icon={<LogoutIcon className="size-5.5" />}
      iconTone="danger"
      confirmVariant="destructive"
      confirmLabel="تسجيل الخروج"
      pendingLabel="جارٍ تسجيل الخروج…"
      isPending={logout.isPending}
      onConfirm={async () => {
        queryClient.removeQueries({ queryKey: ['admin'] });
        await logout.mutateAsync();
        void navigate(ROUTES.login, { replace: true });
      }}
    />
  );
}
