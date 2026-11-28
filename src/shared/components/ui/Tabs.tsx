import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

const variants = {
  /** Member detail, settings sections: text tabs over a bottom border. */
  underline: {
    list: 'flex gap-1 overflow-x-auto border-b border-border',
    tab: 'h-[50px] px-3.5',
    on: 'text-foreground shadow-[inset_0_-3px_0_var(--color-primary)]',
  },
  /** Disputes status: pill tabs on a track. */
  segmented: {
    list: 'inline-flex rounded-xl bg-muted p-1',
    tab: 'h-[38px] rounded-[9px] px-4',
    on: 'bg-surface-raised text-foreground shadow-sm',
  },
} as const;

export type TabItem<V extends string = string> = {
  value: V;
  label: ReactNode;
  /** Shown after the label as "(7)". */
  count?: number;
  disabled?: boolean;
};

export type TabsProps<V extends string = string> = {
  items: readonly TabItem<V>[];
  /** Accessible name of the tab list, e.g. "حالة النزاع". */
  label: string;
  /** Controlled value. For `?tab=` in the URL, pass the pair from `useTabParam`. */
  value?: V;
  defaultValue?: V;
  onValueChange?: (value: V) => void;
  variant?: keyof typeof variants;
  /** Content of the selected tab, rendered in the tab panel. Omit to render the list only. */
  children?: ReactNode;
  className?: string;
  panelClassName?: string;
};

/**
 * WAI-ARIA tabs with automatic activation: one tab stop (roving tabindex), arrow keys move
 * and select in reading direction (flipped in RTL), Home/End jump to the first/last tab.
 */
export function Tabs<V extends string = string>({
  items,
  label,
  value,
  defaultValue,
  onValueChange,
  variant = 'underline',
  children,
  className,
  panelClassName,
}: TabsProps<V>) {
  const baseId = useId();
  const tabRefs = useRef(new Map<V, HTMLButtonElement>());
  const enabled = items.filter((item) => !item.disabled);
  const [internal, setInternal] = useState(defaultValue ?? enabled[0]?.value);
  const requested = value ?? internal;
  const selected = enabled.some((item) => item.value === requested) ? requested : enabled[0]?.value;
  const styles = variants[variant];
  const tabId = (v: V) => `${baseId}-tab-${v}`;
  const panelId = `${baseId}-panel`;

  function select(next: V) {
    if (value === undefined) setInternal(next);
    if (next !== selected) onValueChange?.(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const index = enabled.findIndex((item) => item.value === selected);
    const last = enabled.length - 1;
    const targets: Record<string, number> = {
      [rtl ? 'ArrowLeft' : 'ArrowRight']: index === last ? 0 : index + 1,
      [rtl ? 'ArrowRight' : 'ArrowLeft']: index <= 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const target = enabled[targets[event.key] ?? -1];
    if (!target) return;
    event.preventDefault();
    select(target.value);
    tabRefs.current.get(target.value)?.focus();
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className={cn(variant === 'underline' ? 'self-stretch' : 'self-start', styles.list)}
      >
        {items.map((item) => {
          const isSelected = item.value === selected;
          return (
            <button
              key={item.value}
              ref={(node) => {
                if (node) tabRefs.current.set(item.value, node);
                else tabRefs.current.delete(item.value);
              }}
              type="button"
              role="tab"
              id={tabId(item.value)}
              aria-selected={isSelected}
              aria-controls={children === undefined ? undefined : panelId}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.value)}
              className={cn(
                'inline-flex flex-none items-center gap-1.5 text-sm font-semibold whitespace-nowrap',
                'transition-[color,background-color,box-shadow] duration-micro',
                'disabled:cursor-not-allowed disabled:opacity-50',
                styles.tab,
                isSelected ? styles.on : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
              {item.count !== undefined && (
                <span dir="ltr" className="font-latin tabular-nums">
                  ({item.count})
                </span>
              )}
            </button>
          );
        })}
      </div>
      {children !== undefined && selected !== undefined && (
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(selected)}
          tabIndex={0}
          className={cn('rounded-lg', panelClassName)}
        >
          {children}
        </div>
      )}
    </div>
  );
}
