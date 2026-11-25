import { EmptyState } from '@/shared/components/EmptyState';
import { PageHeader } from '@/shared/components/PageHeader';

export function LoginPage() {
  return (
    <>
      <PageHeader title="تسجيل الدخول" description="سيتم بناء النموذج ضمن مهمة auth." />
      <EmptyState title="قيد التطوير" description="features/auth" />
    </>
  );
}
