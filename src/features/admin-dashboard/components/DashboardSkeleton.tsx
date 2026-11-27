import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

/** Loading state with the same layout as the dashboard. */
export function DashboardSkeleton() {
  return (
    <Stack spacing={3} aria-busy="true">
      <Skeleton variant="rounded" height={320} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Skeleton variant="rounded" height={340} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Skeleton variant="rounded" height={340} />
        </Grid>
      </Grid>
    </Stack>
  );
}
