import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export type MetricItemProps = {
  label: string;
  /** Already formatted, e.g. `formatNumber(1240)`. */
  value: string;
  icon?: ReactNode;
};

/** A label over a number, for rows of small metrics (e.g. under a hero number). */
export function MetricItem({ label, value, icon }: MetricItemProps) {
  return (
    <Stack spacing={0.75}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {icon}
        <Typography variant="h6" component="p" sx={{ fontSize: '1.35rem', fontWeight: 700 }}>
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
}
