import { Link } from 'react-router';
import { Ltr } from '@/shared/components/ui/Ltr';
import { ROUTES } from '@/shared/constants/routes';
import type { AdminDispute, AdminPerson } from '../schemas/dispute.schema';

export type PartiesRatingsCardProps = { dispute: AdminDispute };

const pluralRules = new Intl.PluralRules('ar');

/** Arabic count phrase: zero / one / two / few (3–10) / many (11–99) / other. */
function countText(n: number, forms: Record<Intl.LDMLPluralRule, string>) {
  return forms[pluralRules.select(n)].replace('{n}', String(n));
}

const ratingsText = (n: number) =>
  countText(n, {
    zero: 'لا تقييمات',
    one: 'تقييم واحد',
    two: 'تقييمان',
    few: '{n} تقييمات',
    many: '{n} تقييماً',
    other: '{n} تقييم',
  });

const disputesText = (n: number) =>
  countText(n, {
    zero: 'بلا نزاعات',
    one: 'نزاع واحد',
    two: 'نزاعان',
    few: '{n} نزاعات',
    many: '{n} نزاعاً',
    other: '{n} نزاع',
  });

/** Each side's rating average and count (contract), plus 🟡 `disputesCount` when sent. */
export function PartiesRatingsCard({ dispute }: PartiesRatingsCardProps) {
  return (
    <section
      aria-labelledby="ratings-title"
      className="flex min-w-0 flex-col gap-3 rounded-xl border bg-surface p-5"
    >
      <h2 id="ratings-title" className="text-[15px] font-bold">
        تقييمات الطرفين السابقة
      </h2>
      <PersonRow person={dispute.receiver} role="المستلم" />
      <PersonRow person={dispute.provider} role="مقدم الخدمة" />
    </section>
  );
}

function PersonRow({ person, role }: { person: AdminPerson; role: string }) {
  return (
    <Link
      to={ROUTES.admin.member(person.id)}
      className="flex items-center justify-between gap-2 rounded-[10px] border border-border-subtle p-3 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <div className="min-w-0">
        <p className="text-[13px] font-semibold">
          <bdi>{person.fullName}</bdi> · {role}
        </p>
        <p className="text-xs text-muted-foreground">
          {ratingsText(person.ratingCount)}
          {person.disputesCount !== undefined && ` · ${disputesText(person.disputesCount)}`}
        </p>
      </div>
      {person.ratingCount > 0 && (
        <span className="flex items-center gap-1 text-[15px] font-bold">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-warning">
            <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z" />
          </svg>
          <span className="sr-only">التقييم</span>
          <Ltr>{person.ratingAvg.toFixed(1)}</Ltr>
        </span>
      )}
    </Link>
  );
}
