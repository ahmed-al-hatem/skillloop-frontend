import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useAdminDashboard } from '../api/adminDashboard.queries';
import { AttentionList } from '../components/AttentionList';
import { BookingsByStatusChart } from '../components/BookingsByStatusChart';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { DashboardStats } from '../components/DashboardStats';
import { MembersChart } from '../components/MembersChart';
import { dashboardStrings as t } from '../strings';

/** /admin — platform numbers from `GET /admin/dashboard` (SRS ADM-01). */
export function AdminDashboardPage() {
  const { data, isPending, isError, error, refetch } = useAdminDashboard();

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Typography component="h1" variant="h4">
        {t.title}
      </Typography>

      {isPending ? (
        <DashboardSkeleton />
      ) : isError ? (
        <ErrorState message={error.message || t.loadError} onRetry={() => void refetch()} />
      ) : data.members.total === 0 ? (
        <EmptyState title={t.emptyTitle} description={t.emptyDescription} />
      ) : (
        <>
          <DashboardStats data={data} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <BookingsByStatusChart bookingsByStatus={data.bookingsByStatus} />
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Stack spacing={2}>
                <MembersChart members={data.members} />
                <AttentionList data={data} />
              </Stack>
            </Grid>
          </Grid>
        </>
      )}
    </Stack>
  );
}
