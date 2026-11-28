import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Ltr } from '@/shared/components/ui/Ltr';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { ROUTES } from '@/shared/constants/routes';
import { formatDate } from '@/shared/lib/format';
import { memberStatusBadge } from '../constants';
import type { AdminUserDetails } from '../schemas/member.schema';

export type MemberHeaderProps = {
  member: AdminUserDetails;
  /** Slot for the header buttons: «تعديل النقاط» (4.5) and «إيقاف العضو» / «رفع الإيقاف» (4.4). */
  actions?: ReactNode;
};

/** Back link, then avatar, name, status, contact details and join date. */
export function MemberHeader({ member, actions }: MemberHeaderProps) {
  const status = memberStatusBadge[member.status];

  return (
    <>
      <Link
        to={ROUTES.admin.members}
        className="inline-flex w-fit items-center gap-1.5 rounded-sm text-[13px] font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {/* Points "back" in LTR; `rtl:-scale-x-100` mirrors it for Arabic. */}
        <svg
          aria-hidden="true"
          className="size-4 rtl:-scale-x-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 6-6 6 6 6" />
        </svg>
        العودة إلى الأعضاء
      </Link>
      <section
        aria-label="الملف الشخصي"
        className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border bg-surface p-5.5"
      >
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={member.fullName} src={member.photoUrl} size="lg" decorative />
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[22px] font-bold">{member.fullName}</h1>
              <StatusBadge variant={status.variant}>{status.label}</StatusBadge>
            </div>
            <p className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
              <Ltr>{member.email}</Ltr>
              {member.phone && <Ltr>{member.phone}</Ltr>}
              {member.city && <span>{member.city}</span>}
              <span>انضم في {formatDate(member.createdAt)}</span>
            </p>
            {member.status === 'SUSPENDED' && member.suspendedReason && (
              <p className="text-[13px] text-danger">
                سبب الإيقاف: {member.suspendedReason}
                {member.suspendedAt && <> · منذ {formatDate(member.suspendedAt)}</>}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
      </section>
    </>
  );
}
