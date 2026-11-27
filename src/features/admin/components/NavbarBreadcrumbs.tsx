import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { useActiveNavItem } from '../hooks/useActiveNavItem';
import { adminStrings } from '../strings';
import { flipInRtl } from '../theme/flipInRtl';

/** "Admin panel › <current section>". The separator arrow is mirrored in RTL. */
export function NavbarBreadcrumbs() {
  const active = useActiveNavItem();

  return (
    <Breadcrumbs
      aria-label={adminStrings.breadcrumb}
      separator={<NavigateNextRoundedIcon fontSize="small" sx={flipInRtl} />}
    >
      <Typography variant="body2">{adminStrings.panelName}</Typography>
      {active && (
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {active.label}
        </Typography>
      )}
    </Breadcrumbs>
  );
}
