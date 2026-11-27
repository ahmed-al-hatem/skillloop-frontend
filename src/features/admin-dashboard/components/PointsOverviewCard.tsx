import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MetricItem } from '@/features/admin-ui';
import { formatNumber } from '@/shared/lib/format';
import type { AdminDashboard } from '../schemas/adminDashboard.schema';
import { dashboardStrings as t } from '../strings';
import { VerificationBars } from './VerificationBars';

export type PointsOverviewCardProps = {
  data: AdminDashboard;
};

/** Hero card: points in circulation + member verification, with the key counts underneath. */
export function PointsOverviewCard({ data }: PointsOverviewCardProps) {
  const metrics = [
    { key: 'members', label: t.metrics.members, value: data.members.total },
    { key: 'activeServices', label: t.metrics.activeServices, value: data.activeServices },
    { key: 'activeMembers30d', label: t.metrics.activeMembers30d, value: data.activeMembers30d },
    { key: 'suspended', label: t.metrics.suspended, value: data.members.suspended },
  ];

  return (
    <Card sx={{ p: { xs: 2.5, md: 3 } }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={1.5} sx={{ height: '100%', justifyContent: 'center' }}>
            <Typography component="h2" variant="h6">
              {t.points.title}
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography
                variant="h3"
                component="p"
                sx={{ fontSize: { xs: '2.25rem', md: '3rem' } }}
              >
                {formatNumber(data.pointsInCirculation)}
              </Typography>
              <Chip
                size="small"
                color="secondary"
                label={t.points.perActiveMember(formatNumber(data.pointsPerActiveMember))}
              />
            </Stack>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t.points.hint}
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <VerificationBars members={data.members} />
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 3,
          p: 2.5,
          borderRadius: '16px',
          border: 1,
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          divider={<Divider flexItem orientation="vertical" />}
          spacing={{ xs: 2, sm: 3 }}
          sx={{ '& > :not(hr)': { flex: 1 } }}
        >
          {metrics.map(({ key, label, value }) => (
            <MetricItem key={key} label={label} value={formatNumber(value)} />
          ))}
        </Stack>
      </Box>
    </Card>
  );
}
