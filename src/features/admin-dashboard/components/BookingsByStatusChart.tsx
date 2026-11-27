import { useTheme } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { ChartCard } from '@/features/admin-ui';
import { formatNumber } from '@/shared/lib/format';
import { BOOKING_STATUSES, type AdminDashboard } from '../schemas/adminDashboard.schema';
import { dashboardStrings as t } from '../strings';

export type BookingsByStatusChartProps = {
  bookingsByStatus: AdminDashboard['bookingsByStatus'];
};

/**
 * Horizontal bars, one per booking status (a missing status counts as 0).
 * In RTL the labels sit on the right and the bars grow to the left.
 */
export function BookingsByStatusChart({ bookingsByStatus }: BookingsByStatusChartProps) {
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const counts = BOOKING_STATUSES.map((status) => bookingsByStatus[status] ?? 0);
  const total = counts.reduce((sum, n) => sum + n, 0);

  return (
    <ChartCard title={t.bookings.title} subtitle={t.bookings.subtitle(formatNumber(total))}>
      <BarChart
        layout="horizontal"
        height={320}
        yAxis={[
          {
            scaleType: 'band',
            data: BOOKING_STATUSES.map((status) => t.bookingStatus[status]),
            width: 96,
            position: isRtl ? 'right' : 'left',
          },
        ]}
        xAxis={[
          {
            reverse: isRtl,
            // Taller than the default: Noto Sans Arabic has a tall line box, and x-charts
            // hides tick labels that don't fit the axis height.
            height: 36,
            valueFormatter: (value: number) => formatNumber(value),
          },
        ]}
        series={[
          {
            data: counts,
            label: t.bookings.seriesLabel,
            color: theme.palette.primary.main,
            valueFormatter: (value) => formatNumber(value ?? 0),
          },
        ]}
        hideLegend
        grid={{ vertical: true }}
        margin={{ left: 16, right: 16 }}
      />
    </ChartCard>
  );
}
