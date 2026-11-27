import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useAdminDashboard } from '../api/adminDashboard.queries';
import { AttentionCard } from '../components/AttentionCard';
import { BookingsCard } from '../components/BookingsCard';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { PointsOverviewCard } from '../components/PointsOverviewCard';
import { dashboardStrings as t } from '../strings';

/** /admin — platform numbers from `GET /admin/dashboard` (SRS ADM-01). */
export function AdminDashboardPage() {
  const { data, isPending, isError, error, refetch } = useAdminDashboard();

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Box>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t.overline}
        </Typography>
        <Typography component="h1" variant="h4">
          {t.greeting}
        </Typography>
      </Box>

      {isPending ? (
        <DashboardSkeleton />
      ) : isError ? (
        <ErrorState message={error.message || t.loadError} onRetry={() => void refetch()} />
      ) : data.members.total === 0 ? (
        <EmptyState title={t.emptyTitle} description={t.emptyDescription} />
      ) : (
        <>
          <PointsOverviewCard data={data} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <BookingsCard bookingsByStatus={data.bookingsByStatus} />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <AttentionCard data={data} />
            </Grid>
          </Grid>
        </>
      )}
    </Stack>
  );
}
