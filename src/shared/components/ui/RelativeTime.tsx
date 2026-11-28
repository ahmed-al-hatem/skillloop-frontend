import { cn } from '@/shared/lib/cn';
import { formatFullDateTime, formatRelative } from '@/shared/lib/format';
import { Tooltip } from './Tooltip';

export type RelativeTimeProps = {
  /** ISO date-time from the API (UTC). Shown in the viewer's local time. */
  value: string;
  className?: string;
};

/** "منذ 3 ساعات", with the full local date in a tooltip (hover or keyboard focus). */
export function RelativeTime({ value, className }: RelativeTimeProps) {
  return (
    <Tooltip content={formatFullDateTime(value)}>
      <time dateTime={value} tabIndex={0} className={cn('rounded-sm whitespace-nowrap', className)}>
        {formatRelative(value)}
      </time>
    </Tooltip>
  );
}
