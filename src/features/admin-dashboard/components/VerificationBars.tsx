import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatNumber } from '@/shared/lib/format';
import type { AdminDashboard } from '../schemas/adminDashboard.schema';
import { dashboardStrings as t } from '../strings';

const BAR_COUNT = 28;

export type VerificationBarsProps = {
  members: AdminDashboard['members'];
};

/** Share of verified members as a row of thin bars: filled = verified, dim = not verified. */
export function VerificationBars({ members }: VerificationBarsProps) {
  const ratio = members.total > 0 ? members.verified / members.total : 0;
  const filled = Math.round(ratio * BAR_COUNT);
  const unverified = Math.max(0, members.total - members.verified);

  return (
    <Stack spacing={2} sx={{ height: '100%', justifyContent: 'space-between' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t.verification.title}
        </Typography>
        <Typography variant="h4" component="p">
          {t.verification.percent(formatNumber(ratio * 100, undefined, 0))}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        role="img"
        aria-label={`${t.verification.verified} ${formatNumber(members.verified)} · ${t.verification.unverified} ${formatNumber(unverified)}`}
        sx={{ gap: 0.75, height: 96, alignItems: 'flex-end' }}
      >
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <Box
            key={i}
            sx={{
              flex: 1,
              height: '100%',
              borderRadius: 999,
              bgcolor: i < filled ? 'primary.main' : 'action.selected',
            }}
          />
        ))}
      </Stack>

      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t.verification.verified} · <b>{formatNumber(members.verified)}</b>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t.verification.unverified} · <b>{formatNumber(unverified)}</b>
        </Typography>
      </Stack>
    </Stack>
  );
}
