import { useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts/PieChart';
import { ChartCard } from '@/features/admin-ui';
import { formatNumber } from '@/shared/lib/format';
import type { AdminDashboard } from '../schemas/adminDashboard.schema';
import { dashboardStrings as t } from '../strings';

export type MembersChartProps = {
  members: AdminDashboard['members'];
};

/** Donut: verified vs. not verified members. */
export function MembersChart({ members }: MembersChartProps) {
  const theme = useTheme();
  const unverified = Math.max(0, members.total - members.verified);

  return (
    <ChartCard title={t.members.title}>
      <PieChart
        height={260}
        series={[
          {
            innerRadius: 60,
            outerRadius: 100,
            paddingAngle: 2,
            cornerRadius: 4,
            valueFormatter: ({ value }) => formatNumber(value),
            data: [
              {
                id: 'verified',
                value: members.verified,
                label: t.members.verified,
                color: theme.palette.primary.main,
              },
              {
                id: 'unverified',
                value: unverified,
                label: t.members.unverified,
                color: theme.palette.divider,
              },
            ],
          },
        ]}
        slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom' } } }}
      />
    </ChartCard>
  );
}
