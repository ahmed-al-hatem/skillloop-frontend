import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ChartCard } from '@/features/admin-ui';
import { formatNumber } from '@/shared/lib/format';
import type { AdminDashboard } from '../schemas/adminDashboard.schema';
import { dashboardStrings as t } from '../strings';

export type AttentionListProps = {
  data: Pick<AdminDashboard, 'openDisputes' | 'pendingSuggestions'>;
};

/**
 * Work waiting for the admin. Items become links when the disputes and
 * category-suggestions sections are built.
 */
export function AttentionList({ data }: AttentionListProps) {
  const items = [
    {
      key: 'disputes',
      label: t.attention.openDisputes,
      count: data.openDisputes,
      icon: GavelRoundedIcon,
    },
    {
      key: 'suggestions',
      label: t.attention.pendingSuggestions,
      count: data.pendingSuggestions,
      icon: CategoryRoundedIcon,
    },
  ];

  return (
    <ChartCard title={t.attention.title}>
      <List dense disablePadding sx={{ mt: 1 }}>
        {items.map(({ key, label, count, icon: Icon }) => (
          <ListItem key={key} disableGutters>
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} />
            <Chip
              size="small"
              label={formatNumber(count)}
              color={count > 0 ? 'primary' : 'default'}
              variant={count > 0 ? 'filled' : 'outlined'}
            />
          </ListItem>
        ))}
      </List>
    </ChartCard>
  );
}
