import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Dialog } from '@/shared/components/ui/Dialog';

export type LightboxImage = {
  id: string;
  src: string;
  /** Required: describes the image for screen readers and as its caption. */
  alt: string;
  /** Smaller image for the gallery grid. Falls back to `src`. */
  thumbnailSrc?: string;
};

export type LightboxProps = {
  images: LightboxImage[];
  /** Index of the image to show, or `null` when closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
  title?: ReactNode;
};

// Chevron points "forward" in LTR; `rtl:-scale-x-100` mirrors it for Arabic.
const chevron = (path: string) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-5 rtl:-scale-x-100"
  >
    <path d={path} />
  </svg>
);

const navClass =
  'flex size-11 flex-none items-center justify-center rounded-full border border-border bg-surface-raised text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

/**
 * Full-size image viewer on `Dialog` (focus trap, Esc, focus restore). Arrow keys move
 * between images following the reading direction: in RTL, ArrowLeft is "next".
 */
export function Lightbox({ images, index, onIndexChange, title = 'المرفقات' }: LightboxProps) {
  const nextRef = useRef<HTMLButtonElement>(null);
  const open = index !== null && images.length > 0;
  const current = open ? Math.min(index, images.length - 1) : 0;
  const image = images[current];
  const hasMany = images.length > 1;

  function go(step: 1 | -1) {
    onIndexChange((current + step + images.length) % images.length);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasMany || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault();
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const forward = event.key === (rtl ? 'ArrowLeft' : 'ArrowRight');
    go(forward ? 1 : -1);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onIndexChange(null)}
      title={title}
      size="lg"
      className="max-w-4xl"
      initialFocusRef={hasMany ? nextRef : undefined}
      footer={
        <Button variant="outline" onClick={() => onIndexChange(null)}>
          إغلاق
        </Button>
      }
    >
      {image && (
        <div onKeyDown={onKeyDown} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {hasMany && (
              <button
                type="button"
                aria-label="الصورة السابقة"
                onClick={() => go(-1)}
                className={navClass}
              >
                {chevron('m15 18-6-6 6-6')}
              </button>
            )}
            <img
              key={image.id}
              src={image.src}
              alt={image.alt}
              className="max-h-[70vh] min-w-0 flex-1 rounded-xl bg-background object-contain"
            />
            {hasMany && (
              <button
                ref={nextRef}
                type="button"
                aria-label="الصورة التالية"
                onClick={() => go(1)}
                className={navClass}
              >
                {chevron('m9 18 6-6-6-6')}
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <p className="min-w-0 truncate">{image.alt}</p>
            <p aria-live="polite" className="flex-none">
              <span className="sr-only">الصورة </span>
              <bdi dir="ltr" className="font-latin tabular-nums">
                {current + 1} / {images.length}
              </bdi>
            </p>
          </div>
        </div>
      )}
    </Dialog>
  );
}
