import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

const tones = {
  neutral: 'bg-muted-foreground',
  primary: 'bg-primary',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
} as const;

export type TimelineTone = keyof typeof tones;

export type TimelineEvent = {
  id: string;
  label: ReactNode;
  /** Who did it, e.g. "المستلم" or "مقدم الخدمة". Shown after the label. */
  actorRole?: ReactNode;
  /** The event time, already rendered — e.g. `<RelativeTime value={at} />`. */
  time: ReactNode;
  /** Colour of the event's dot. Defaults to `neutral`. */
  tone?: TimelineTone;
};

export type TimelineProps = {
  /** Events in display order (oldest first). */
  events: TimelineEvent[];
  /** `sm` for drawers, `md` for page cards. */
  size?: 'sm' | 'md';
  /** Shown instead of the list when there are no events. */
  emptyText?: ReactNode;
  className?: string;
};

/** Ordered list of booking/dispute events with a dot-and-line rail on the start side. */
export function Timeline({
  events,
  size = 'md',
  emptyText = 'لا توجد أحداث بعد',
  className,
}: TimelineProps) {
  if (events.length === 0) {
    return <p className={cn('text-sm text-muted-foreground', className)}>{emptyText}</p>;
  }

  return (
    <ol className={cn('flex flex-col', className)}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <li key={event.id} className="flex gap-3">
            <div aria-hidden="true" className="flex flex-col items-center">
              <span
                className={cn(
                  'flex-none rounded-full',
                  size === 'sm' ? 'mt-1.25 size-2.5' : 'mt-1 size-3',
                  tones[event.tone ?? 'neutral'],
                )}
              />
              {!isLast && <span className="min-h-4 w-0.5 flex-1 bg-border" />}
            </div>
            <div className={cn('flex min-w-0 flex-col gap-0.5', !isLast && 'pb-3')}>
              <p className="text-sm font-semibold">
                {event.label}
                {event.actorRole && (
                  <span className="font-normal text-muted-foreground"> · {event.actorRole}</span>
                )}
              </p>
              <div className="text-xs text-muted-foreground">{event.time}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
