import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export type SectionCardProps = {
  title: string;
  /** Optional element at the end of the title row (a link, a menu…). */
  action?: ReactNode;
  children: ReactNode;
};

/** Dark rounded card with a title row — the building block of every admin page. */
export function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h6">
          {title}
        </Typography>
        {action}
      </Stack>
      {children}
    </Card>
  );
}
