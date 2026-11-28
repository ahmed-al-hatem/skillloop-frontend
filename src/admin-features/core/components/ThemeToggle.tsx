import { Tooltip } from '@/shared/components/ui/Tooltip';
import { useTheme } from '@/shared/hooks/useTheme';
import { cn } from '@/shared/lib/cn';

/** Half-filled circle that turns over when the theme flips (Sidebar artboard). */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'light' ? 'التبديل إلى الوضع الداكن' : 'التبديل إلى الوضع الفاتح';

  return (
    <Tooltip content={label} side="bottom">
      <button
        type="button"
        aria-label={label}
        onClick={toggleTheme}
        className="flex size-8.5 items-center justify-center rounded-[9px] text-muted-foreground transition-colors duration-micro hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none pointer-coarse:size-11"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={cn(
            'size-4.5 transition-transform duration-500 ease-[cubic-bezier(.3,1.4,.5,1)]',
            theme === 'light' && 'rotate-180',
          )}
        >
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
        </svg>
      </button>
    </Tooltip>
  );
}
