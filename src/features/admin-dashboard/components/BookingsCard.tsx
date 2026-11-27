import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LegendItem, SectionCard } from '@/features/admin-ui';
import { formatNumber } from '@/shared/lib/format';
import { BOOKING_GROUPS, groupCount, statusCount } from '../bookingGroups';
import type { AdminDashboard } from '../schemas/adminDashboard.schema';
import { dashboardStrings as t } from '../strings';
import { BookingRings } from './BookingRings';

export type BookingsCardProps = {
  bookingsByStatus: AdminDashboard['bookingsByStatus'];
};

/** Total bookings, a legend per group (with each status inside it) and the rings chart. */
export function BookingsCard({ bookingsByStatus }: BookingsCardProps) {
  const total = BOOKING_GROUPS.reduce((sum, g) => sum + groupCount(bookingsByStatus, g), 0);

  return (
    <SectionCard title={t.bookings.title}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{ alignItems: 'center', justifyContent: 'space-between', flexGrow: 1 }}
      >
        <Stack spacing={2.5} sx={{ alignSelf: 'stretch' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t.bookings.total}
            </Typography>
            <Typography variant="h4" component="p">
              {formatNumber(total)}
            </Typography>
          </Box>
          <Stack spacing={1.5}>
            {BOOKING_GROUPS.map((group) => (
              <LegendItem
                key={group.key}
                color={group.color}
                label={t.bookings.groups[group.key]}
                value={formatNumber(groupCount(bookingsByStatus, group))}
                detail={
                  group.statuses.length > 1
                    ? group.statuses
                        .map(
                          (s) =>
                            `${t.bookingStatus[s]} ${formatNumber(statusCount(bookingsByStatus, s))}`,
                        )
                        .join(' · ')
                    : undefined
                }
              />
            ))}
          </Stack>
        </Stack>
        <BookingRings bookingsByStatus={bookingsByStatus} total={total} />
      </Stack>
    </SectionCard>
  );
}
