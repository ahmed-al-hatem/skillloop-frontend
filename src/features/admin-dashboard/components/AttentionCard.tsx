import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SectionCard } from '@/features/admin-ui';
import { formatNumber } from '@/shared/lib/format';
import type { AdminDashboard } from '../schemas/adminDashboard.schema';
import { dashboardStrings as t } from '../strings';

export type AttentionCardProps = {
  data: Pick<AdminDashboard, 'openDisputes' | 'pendingSuggestions'>;
};

/**
 * Work waiting for the admin. Rows become links when the disputes and
 * category-suggestions sections are built.
 */
export function AttentionCard({ data }: AttentionCardProps) {
  const rows = [
    {
      key: 'disputes',
      label: t.attention.openDisputes,
      hint: t.attention.openDisputesHint,
      count: data.openDisputes,
      icon: GavelRoundedIcon,
    },
    {
      key: 'suggestions',
      label: t.attention.pendingSuggestions,
      hint: t.attention.pendingSuggestionsHint,
      count: data.pendingSuggestions,
      icon: CategoryRoundedIcon,
    },
  ];

  return (
    <SectionCard title={t.attention.title}>
      <Stack spacing={1}>
        {rows.map(({ key, label, hint, count, icon: Icon }) => (
          <Stack
            key={key}
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: 'center',
              p: 1.5,
              borderRadius: '16px',
              bgcolor: 'background.default',
            }}
          >
            <Avatar
              sx={{ bgcolor: 'action.selected', color: 'text.primary', width: 40, height: 40 }}
            >
              <Icon fontSize="small" />
            </Avatar>
            <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {hint}
              </Typography>
            </Stack>
            <Chip
              size="small"
              label={count > 0 ? t.attention.needsReview : t.attention.allClear}
              color={count > 0 ? 'secondary' : 'default'}
              variant={count > 0 ? 'filled' : 'outlined'}
            />
            <Typography variant="h6" component="p" sx={{ minWidth: 32, textAlign: 'right' }}>
              {formatNumber(count)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </SectionCard>
  );
}
