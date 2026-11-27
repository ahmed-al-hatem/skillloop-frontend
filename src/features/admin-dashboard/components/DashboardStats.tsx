import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import Grid from '@mui/material/Grid';
import { StatCard } from '@/features/admin-ui';
import { formatNumber } from '@/shared/lib/format';
import type { AdminDashboard } from '../schemas/adminDashboard.schema';
import { dashboardStrings as t } from '../strings';

export type DashboardStatsProps = {
  data: AdminDashboard;
};

/** The row of number cards at the top of the dashboard. */
export function DashboardStats({ data }: DashboardStatsProps) {
  const cards = [
    {
      key: 'members',
      title: t.stats.members,
      value: formatNumber(data.members.total),
      caption: t.stats.membersCaption(
        formatNumber(data.members.verified),
        formatNumber(data.members.suspended),
      ),
      icon: <GroupRoundedIcon />,
    },
    {
      key: 'activeServices',
      title: t.stats.activeServices,
      value: formatNumber(data.activeServices),
      icon: <StorefrontRoundedIcon />,
    },
    {
      key: 'activeMembers30d',
      title: t.stats.activeMembers30d,
      value: formatNumber(data.activeMembers30d),
      caption: t.stats.activeMembers30dCaption,
      icon: <HandshakeRoundedIcon />,
    },
    {
      key: 'pointsInCirculation',
      title: t.stats.pointsInCirculation,
      value: formatNumber(data.pointsInCirculation),
      caption: t.stats.pointsInCirculationCaption,
      icon: <SavingsRoundedIcon />,
    },
    {
      key: 'pointsPerActiveMember',
      title: t.stats.pointsPerActiveMember,
      value: formatNumber(data.pointsPerActiveMember),
      caption: t.stats.pointsPerActiveMemberCaption,
      icon: <TrendingUpRoundedIcon />,
    },
  ];

  return (
    <Grid container spacing={2} columns={10}>
      {cards.map(({ key, ...card }) => (
        <Grid key={key} size={{ xs: 10, sm: 5, lg: 2 }}>
          <StatCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}
