import { useState, type ComponentProps } from 'react';
import { cn } from '@/shared/lib/cn';

const sizes = {
  sm: 'size-7 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-16 text-2xl',
} as const;

const tones = {
  soft: 'bg-accent text-accent-foreground',
  solid: 'bg-primary text-primary-foreground',
} as const;

export type AvatarProps = Omit<ComponentProps<'span'>, 'children'> & {
  /** Full name: used for the fallback letter and as the accessible name. */
  name: string;
  src?: string | null;
  size?: keyof typeof sizes;
  tone?: keyof typeof tones;
  /** Set when the name is already shown next to the avatar, so it isn't read twice. */
  decorative?: boolean;
};

/** First letter of the name (one letter, so Arabic letters don't join), upper-cased for Latin. */
function getInitial(name: string) {
  return (Array.from(name.trim())[0] ?? '?').toLocaleUpperCase();
}

export function Avatar({
  name,
  src,
  size = 'md',
  tone = 'soft',
  decorative = false,
  className,
  ...props
}: AvatarProps) {
  // Remember which src failed, so a new src gets a fresh try.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && src !== failedSrc;

  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold select-none',
        sizes[size],
        tones[tone],
        className,
      )}
      {...props}
    >
      {/* The initial stays underneath, so it shows while the image loads. */}
      {getInitial(name)}
      {showImage && (
        <img
          src={src ?? undefined}
          alt=""
          className="absolute inset-0 size-full object-cover"
          onError={() => setFailedSrc(src ?? null)}
        />
      )}
    </span>
  );
}
