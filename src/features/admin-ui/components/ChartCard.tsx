import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/** Card with a title for a chart or a short list. */
export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <Typography component="h2" variant="subtitle2" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Card>
  );
}
