import { EmptyState } from '@/shared/components/EmptyState';
import { PageHeader } from '@/shared/components/PageHeader';

export function RegisterPage() {
  return (
    <>
      <PageHeader title="إنشاء حساب" description="سيتم بناء النموذج ضمن مهمة auth." />
      <EmptyState title="قيد التطوير" description="features/auth" />
    </>
  );
}
