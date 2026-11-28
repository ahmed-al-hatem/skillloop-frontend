import { Link } from 'react-router';
import { Avatar } from '@/shared/components/ui/Avatar';
import { ROUTES } from '@/shared/constants/routes';
import type { AdminPerson } from '../schemas/booking.schema';

export type BookingPartyLinkProps = {
  person: AdminPerson;
};

/** One side of the booking: avatar + name, linking to the member's admin page. */
export function BookingPartyLink({ person }: BookingPartyLinkProps) {
  return (
    <Link
      to={ROUTES.admin.member(person.id)}
      className="inline-flex items-center gap-2 rounded-sm font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Avatar name={person.fullName} src={person.photoUrl} size="sm" decorative />
      <bdi>{person.fullName}</bdi>
    </Link>
  );
}
