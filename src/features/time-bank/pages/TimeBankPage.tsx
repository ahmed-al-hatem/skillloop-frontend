import { EmptyState } from '@/shared/components/EmptyState';
import { PageHeader } from '@/shared/components/PageHeader';

export function TimeBankPage() {
  return (
    <>
      <PageHeader title="بنك الساعات" description="رصيدك من الساعات وسجل الحركات." />
      <EmptyState title="قيد التطوير" description="features/time-bank" />
    </>
  );
}
