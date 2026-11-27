import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export type StatCardProps = {
  title: string;
  /** Already formatted, e.g. `formatNumber(1240)`. */
  value: string;
  /** Short line under the value, e.g. "1,010 موثّق". */
  caption?: string;
  icon?: ReactNode;
};

/** One number with a label (MUI template's StatCard, without the trend sparkline). */
export function StatCard({ title, value, caption, icon }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography component="h3" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
        {icon && <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>}
      </Stack>
      <Typography variant="h4" component="p" sx={{ mt: 1 }}>
        {value}
      </Typography>
      {caption && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {caption}
        </Typography>
      )}
    </Card>
  );
}
