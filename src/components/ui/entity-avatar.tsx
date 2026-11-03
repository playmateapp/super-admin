/* eslint-disable @next/next/no-img-element -- user-uploaded Supabase Storage URLs */
import { cn } from '@/lib/utils';

/**
 * Round picture for a person or team (40px by default). Falls back to initials on a tint
 * when the API has no image. `shape="square"` is the 150px profile picture on detail panels.
 */
export function EntityAvatar({
  src,
  name,
  size = 40,
  shape = 'circle',
  className,
}: {
  src?: string | null;
  name: string;
  size?: number;
  shape?: 'circle' | 'square';
  className?: string;
}) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || '·';
  const style = { width: size, height: size };
  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-[12px]';

  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={style}
        className={cn(
          'shrink-0 border border-line bg-surface-muted object-cover',
          radius,
          className,
        )}
      />
    );
  }
  return (
    <span
      aria-hidden
      style={{ ...style, fontSize: Math.max(11, Math.round(size * 0.36)) }}
      className={cn(
        'grid shrink-0 place-items-center border border-line bg-surface-tint font-display font-semibold text-content-brand',
        radius,
        className,
      )}
    >
      {initials}
    </span>
  );
}
