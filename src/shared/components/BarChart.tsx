import { cn } from '@/shared/lib/cn';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Tooltip } from '@/shared/components/ui/Tooltip';

// Local until the shared formatters land in `@/shared/lib/format`.
const numberFormat = new Intl.NumberFormat('en-US');
const percentFormat = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
});

/** Plot height in px (`h-60`). Bars are drawn in px inside each column's SVG. */
const PLOT_HEIGHT = 240;
const BAR_RADIUS = 6;
const LOADING_HEIGHTS = [
  'h-[30%]',
  'h-[22%]',
  'h-[40%]',
  'h-[18%]',
  'h-[92%]',
  'h-[10%]',
  'h-[26%]',
  'h-[14%]',
];

const tones = {
  primary: { bar: 'fill-primary', swatch: 'bg-primary' },
  success: { bar: 'fill-success', swatch: 'bg-success' },
  warning: { bar: 'fill-warning', swatch: 'bg-warning' },
  danger: { bar: 'fill-danger', swatch: 'bg-danger' },
  info: { bar: 'fill-info', swatch: 'bg-info' },
} as const;

export type BarChartTone = keyof typeof tones;

export type BarChartItem = {
  /** Stable key, e.g. the enum value (`completed`). */
  id: string;
  label: string;
  value: number;
  tone?: BarChartTone;
};

export type BarChartProps = {
  items: BarChartItem[];
  /** Names the data for screen readers (caption of the hidden table). */
  caption: string;
  /** Header of the label column in the hidden table. */
  categoryLabel?: string;
  /** What `value` counts, e.g. "الحجوزات". */
  valueLabel?: string;
  shareLabel?: string;
  isLoading?: boolean;
  className?: string;
};

/** Rounds `max / 3` up to a readable step so the axis has 4 ticks (0 and 3 steps). */
function niceStep(max: number) {
  const raw = max / 3;
  if (raw <= 1) return 1;
  const power = 10 ** Math.floor(Math.log10(raw));
  const steps = power >= 10 ? [1, 1.5, 2, 2.5, 3, 5, 10] : [1, 2, 3, 5, 10];
  return (steps.find((s) => s * power >= raw) ?? 10) * power;
}

/**
 * Small vertical bar chart without a chart library: counts above the bars,
 * labels below, share of the total in a tooltip. The drawing is hidden from
 * screen readers; a visually hidden table carries the same data.
 */
export function BarChart({
  items,
  caption,
  categoryLabel = 'الفئة',
  valueLabel = 'العدد',
  shareLabel = 'من المجموع',
  isLoading = false,
  className,
}: BarChartProps) {
  if (isLoading) {
    return (
      <div aria-busy="true" className={cn('ps-12.5', className)}>
        <div className="grid h-60 auto-cols-fr grid-flow-col items-end gap-3.5 px-2">
          {LOADING_HEIGHTS.map((height) => (
            <Skeleton key={height} className={cn('rounded-b-none', height)} />
          ))}
        </div>
        <Skeleton className="mt-2.5 h-3" />
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.value, 0);
  const step = niceStep(Math.max(0, ...items.map((item) => item.value)));
  const axisMax = step * 3;
  const ticks = [3, 2, 1, 0].map((i) => step * i);
  const share = (value: number) => percentFormat.format(total ? value / total : 0);

  return (
    <div className={className}>
      <div aria-hidden="true" className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-2.5">
        <div className="-my-1.5 flex h-63 flex-col items-end justify-between font-latin text-xs text-muted-foreground">
          {ticks.map((tick) => (
            <span key={tick} dir="ltr">
              {numberFormat.format(tick)}
            </span>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-2.5">
          <div className="relative h-60 border-b border-border">
            <div className="absolute inset-x-0 top-0 border-t border-dashed border-border-subtle" />
            <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-border-subtle" />
            <div className="absolute inset-x-0 top-2/3 border-t border-dashed border-border-subtle" />

            <div className="group/plot absolute inset-0 grid auto-cols-fr grid-flow-col gap-3.5 px-2">
              {items.map((item) => {
                const tone = tones[item.tone ?? 'primary'];
                const height =
                  item.value > 0 ? Math.max(1, (item.value / axisMax) * PLOT_HEIGHT) : 0;
                const corner = Math.min(height, BAR_RADIUS);
                return (
                  <Tooltip
                    key={item.id}
                    content={
                      <span className="flex min-w-36 flex-col gap-1">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <span className={cn('size-2 rounded-xs', tone.swatch)} />
                          {item.label}
                        </span>
                        <span className="flex justify-between gap-4 opacity-80">
                          {valueLabel}
                          <b dir="ltr" className="font-latin">
                            {numberFormat.format(item.value)}
                          </b>
                        </span>
                        <span className="flex justify-between gap-4 opacity-80">
                          {shareLabel}
                          <b dir="ltr" className="font-latin">
                            {share(item.value)}
                          </b>
                        </span>
                      </span>
                    }
                  >
                    <span className="flex flex-1 justify-center transition-opacity duration-micro group-hover/plot:[&:not(:hover)]:opacity-35">
                      <svg className="h-60 w-full max-w-12 overflow-visible">
                        <g
                          className={cn(
                            'origin-bottom transition-transform duration-modal ease-spring [transform-box:fill-box] starting:scale-y-0',
                            tone.bar,
                          )}
                        >
                          <rect
                            x="0"
                            y={PLOT_HEIGHT - height}
                            width="100%"
                            height={height}
                            rx={corner}
                          />
                          <rect x="0" y={PLOT_HEIGHT - corner} width="100%" height={corner} />
                        </g>
                        <text
                          x="50%"
                          y={PLOT_HEIGHT - height - 6}
                          textAnchor="middle"
                          className="fill-foreground font-latin text-xs font-semibold"
                        >
                          {numberFormat.format(item.value)}
                        </text>
                      </svg>
                    </span>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <div className="grid auto-cols-fr grid-flow-col gap-3.5 px-2">
            {items.map((item) => (
              <span
                key={item.id}
                className="text-center text-xs leading-snug text-muted-foreground"
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">{categoryLabel}</th>
            <th scope="col">{valueLabel}</th>
            <th scope="col">{shareLabel}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <th scope="row">{item.label}</th>
              <td>{numberFormat.format(item.value)}</td>
              <td>{share(item.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
