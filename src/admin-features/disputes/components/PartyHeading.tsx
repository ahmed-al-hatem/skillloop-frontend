import type { ReactNode } from 'react';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Badge } from '@/shared/components/ui/Badge';
import { cn } from '@/shared/lib/cn';
import type { AdminPerson } from '../schemas/dispute.schema';

// Receiver in blue, provider in purple, as in the design.
const roles = {
  receiver: {
    label: 'المستلم',
    avatar: 'bg-info-muted text-info',
    badge: 'bg-info-muted text-info',
  },
  provider: {
    label: 'مقدم الخدمة',
    avatar: undefined,
    badge: 'bg-accent text-accent-foreground',
  },
} as const;

export type PartyHeadingProps = {
  /** Id of the `<h2>`, for the card's `aria-labelledby`. */
  titleId: string;
  title: string;
  person: AdminPerson;
  role: keyof typeof roles;
  /** Line under the title, e.g. `<RelativeTime />`. */
  meta: ReactNode;
};

/** Avatar, «title · name», a date line and the side's role badge. */
export function PartyHeading({ titleId, title, person, role, meta }: PartyHeadingProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar
        name={person.fullName}
        src={person.photoUrl}
        decorative
        className={roles[role].avatar}
      />
      <div className="min-w-0 flex-1">
        <h2 id={titleId} className="text-[15px] font-bold">
          {title} · <bdi>{person.fullName}</bdi>
        </h2>
        <div className="text-xs text-muted-foreground">{meta}</div>
      </div>
      <Badge
        variant="outline"
        className={cn('rounded-sm border-current/30 px-2 font-semibold', roles[role].badge)}
      >
        {roles[role].label}
      </Badge>
    </div>
  );
}
