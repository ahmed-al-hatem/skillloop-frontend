import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

/** Loading state with the same layout as the dashboard. */
export function DashboardSkeleton() {
  return (
    <Stack spacing={2} aria-busy="true">
      <Grid container spacing={2} columns={10}>
        {Array.from({ length: 5 }, (_, i) => (
          <Grid key={i} size={{ xs: 10, sm: 5, lg: 2 }}>
            <Skeleton variant="rounded" height={112} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Skeleton variant="rounded" height={380} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Skeleton variant="rounded" height={380} />
        </Grid>
      </Grid>
    </Stack>
  );
}
