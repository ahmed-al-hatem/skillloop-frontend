import type { ComponentProps, MouseEvent } from 'react';
import { cn } from '@/shared/lib/cn';
import { Tooltip } from './Tooltip';

export type SwitchProps = Omit<ComponentProps<'button'>, 'onChange' | 'value'> & {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /**
   * The value can't change (e.g. the "أخرى" category stays active). Unlike `disabled`, the switch
   * stays focusable so keyboard and screen-reader users can find out why.
   */
  locked?: boolean;
  /** Why it is locked. Shown as a tooltip on hover/focus and read as the switch's description. */
  lockedReason?: string;
  /** Called when someone tries to toggle a locked switch, e.g. to show a toast. */
  onLockedClick?: () => void;
};

/**
 * On/off control (`role="switch"`). Label it with `<Label htmlFor={id}>` or `aria-label`.
 * With react-hook-form use a `Controller`:
 * `<Switch id="active" checked={field.value} onCheckedChange={field.onChange} onBlur={field.onBlur} ref={field.ref} />`.
 */
export function Switch({
  checked,
  onCheckedChange,
  locked = false,
  lockedReason,
  onLockedClick,
  disabled,
  className,
  onClick,
  ...props
}: SwitchProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (locked) {
      onLockedClick?.();
      return;
    }
    onCheckedChange?.(!checked);
  };

  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-disabled={locked || undefined}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        // 44 px tall hit area around a 44×26 track.
        'group inline-flex h-11 min-w-11 shrink-0 items-center rounded-full focus-visible:outline-none',
        locked ? 'cursor-not-allowed' : 'cursor-pointer',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex h-6.5 w-11 items-center rounded-full p-0.75 transition-colors duration-micro',
          'group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background',
          // Light theme: the "off" track needs a darker grey to stand out from the page.
          checked ? 'bg-primary' : 'bg-input light:bg-muted-foreground',
          // Locked: a faded track, the knob stays white (design: "مقفل").
          locked && (checked ? 'bg-primary/50' : 'bg-input/60 light:bg-muted-foreground/60'),
        )}
      >
        <span
          className={cn(
            'size-5 rounded-full bg-primary-foreground shadow-sm transition-transform duration-micro ease-spring',
            // Logical direction: "on" moves the knob to the end side, so RTL flips it.
            checked && '-translate-x-4.5 ltr:translate-x-4.5',
          )}
        />
      </span>
    </button>
  );

  if (locked && lockedReason) return <Tooltip content={lockedReason}>{control}</Tooltip>;
  return control;
}
