import { alpha, useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';
import { BOOKING_GROUPS, groupCount } from '../bookingGroups';
import type { AdminDashboard } from '../schemas/adminDashboard.schema';

const SIZE = 220;
const RING = 14;
const GAP = 6;

export type BookingRingsProps = {
  bookingsByStatus: AdminDashboard['bookingsByStatus'];
  total: number;
};

/** Resolves a theme color path like `primary.main` to a color value. */
function useThemeColor() {
  const theme = useTheme();
  return (path: string) =>
    path
      .split('.')
      .reduce<unknown>(
        (node, key) => (node as Record<string, unknown>)[key],
        theme.palette,
      ) as string;
}

/** Concentric rings: one ring per booking group, filled by its share of all bookings. */
export function BookingRings({ bookingsByStatus, total }: BookingRingsProps) {
  const theme = useTheme();
  const color = useThemeColor();
  const track = alpha(theme.palette.text.primary, 0.06);

  return (
    <PieChart
      width={SIZE}
      height={SIZE}
      margin={0}
      hideLegend
      skipAnimation
      slotProps={{ tooltip: { trigger: 'none' } }}
      series={BOOKING_GROUPS.map((group, i) => {
        const outerRadius = SIZE / 2 - i * (RING + GAP);
        const value = groupCount(bookingsByStatus, group);
        return {
          id: group.key,
          outerRadius,
          innerRadius: outerRadius - RING,
          cornerRadius: RING / 2,
          data: [
            { id: 'value', value, color: color(group.color) },
            { id: 'rest', value: Math.max(0, total - value), color: track },
          ],
        };
      })}
    />
  );
}
