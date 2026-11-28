import type { AdminUserDetails } from '../schemas/member.schema';
import { MemberActivityTabs } from './MemberActivityTabs';
import { MemberHeader } from './MemberHeader';
import { TransactionsCard } from './TransactionsCard';
import { WalletCard } from './WalletCard';

export type MemberDetailProps = { member: AdminUserDetails };

/** The loaded member: profile header, wallet beside the last 20 transactions, activity tabs. */
export function MemberDetail({ member }: MemberDetailProps) {
  return (
    <>
      {/* 4.4 / 4.5: pass the suspend / unsuspend and points-adjustment dialog triggers as `actions`. */}
      <MemberHeader member={member} />
      <div className="grid gap-4 lg:grid-cols-3">
        <WalletCard member={member} />
        <TransactionsCard transactions={member.recentTransactions} className="lg:col-span-2" />
      </div>
      <MemberActivityTabs memberId={member.id} />
    </>
  );
}
