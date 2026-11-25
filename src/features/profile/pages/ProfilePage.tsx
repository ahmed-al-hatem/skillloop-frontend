import { EmptyState } from '@/shared/components/EmptyState';
import { PageHeader } from '@/shared/components/PageHeader';

export function ProfilePage() {
  return (
    <>
      <PageHeader title="ملفي" description="المهارات التي أتقنها والمهارات التي أريد تعلّمها." />
      <EmptyState title="قيد التطوير" description="features/profile" />
    </>
  );
}
