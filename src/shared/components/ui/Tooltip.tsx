import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/shared/lib/cn';

// Logical sides, so `start`/`end` flip with RTL. Centring uses translate, which is physical,
// hence the `rtl:` override.
const sides = {
  top: 'bottom-full mb-2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2',
  bottom: 'top-full mt-2 start-1/2 -translate-x-1/2 rtl:translate-x-1/2',
  start: 'end-full me-2 top-1/2 -translate-y-1/2',
  end: 'start-full ms-2 top-1/2 -translate-y-1/2',
} as const;

/** Small delay before hiding, so the pointer can cross the gap onto the tooltip. */
const HIDE_DELAY_MS = 100;

type TriggerProps = { 'aria-describedby'?: string };

export type TooltipProps = {
  content: ReactNode;
  /** One focusable element (button, link…). It gets `aria-describedby` pointing at the tooltip. */
  children: ReactElement<TriggerProps>;
  side?: keyof typeof sides;
  className?: string;
};

/**
 * Short description for a control. Opens on hover and on keyboard focus,
 * closes on Esc, pointer leave or blur. Keep the content plain text: it is
 * read as the trigger's description, so links or buttons inside won't work.
 */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const hideTimer = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(hideTimer.current);
    setOpen(true);
  };
  const hide = (delay = 0) => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setOpen(false), delay);
  };

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  // Esc closes it even when it opened from hover (WCAG 1.4.13).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const describedBy = [children.props['aria-describedby'], id].filter(Boolean).join(' ');

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={show}
      onPointerLeave={() => hide(HIDE_DELAY_MS)}
      onFocus={show}
      onBlur={() => hide()}
    >
      {cloneElement(children, { 'aria-describedby': describedBy })}
      <span
        id={id}
        role="tooltip"
        className={cn(
          'absolute z-50 w-max max-w-65 rounded-md bg-foreground px-2.5 py-2 text-start text-xs leading-[1.7] text-background shadow-lg transition-opacity duration-micro',
          sides[side],
          open ? 'visible opacity-100' : 'invisible opacity-0',
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
}
