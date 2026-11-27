import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export type LegendItemProps = {
  /** A theme color, e.g. `primary.main` or `secondary.main`. */
  color: string;
  label: string;
  value: string;
  /** Optional small line under the label. */
  detail?: ReactNode;
};

/** Colored dot + label + value, for chart legends. */
export function LegendItem({ color, label, value, detail }: LegendItemProps) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
      <Box
        aria-hidden
        sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, mt: 0.75, flexShrink: 0 }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Stack>
        {detail && (
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
            {detail}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
