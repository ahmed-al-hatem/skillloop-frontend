import { useState, type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Lightbox, type LightboxImage } from './Lightbox';

const columnClasses = {
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
} as const;

export type ImageGalleryProps = {
  images: LightboxImage[];
  /** Thumbnails per row. The evidence cards use 5. */
  columns?: keyof typeof columnClasses;
  /** Title of the lightbox opened from a thumbnail. */
  title?: ReactNode;
  /** Shown instead of the grid when there are no images. */
  emptyText?: ReactNode;
  className?: string;
};

/** Square thumbnail grid that opens the full image in a `Lightbox`. */
export function ImageGallery({
  images,
  columns = 5,
  title,
  emptyText = 'لا توجد مرفقات',
  className,
}: ImageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return <p className={cn('text-sm text-muted-foreground', className)}>{emptyText}</p>;
  }

  return (
    <>
      <ul className={cn('grid gap-2', columnClasses[columns], className)}>
        {images.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              aria-label={`فتح الصورة ${index + 1} في العارض: ${image.alt}`}
              onClick={() => setOpenIndex(index)}
              className={cn(
                'block aspect-square w-full cursor-zoom-in overflow-hidden rounded-[10px] border border-border bg-muted',
                'transition-[border-color,opacity] hover:border-primary hover:opacity-90',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              )}
            >
              <img
                src={image.thumbnailSrc ?? image.src}
                alt=""
                loading="lazy"
                className="size-full object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={openIndex} onIndexChange={setOpenIndex} title={title} />
    </>
  );
}
