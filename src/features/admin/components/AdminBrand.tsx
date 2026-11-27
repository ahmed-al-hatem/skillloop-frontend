import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';
import logoUrl from '@/shared/assets/brand/logo-on-light.svg';
import { ROUTES } from '@/shared/constants/routes';
import { adminStrings } from '../strings';

/** Logo + "admin panel" label, shown at the top of the side menu and the mobile bar. */
export function AdminBrand() {
  return (
    <Box
      component={Link}
      to={ROUTES.admin.root}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      <Box component="img" src={logoUrl} alt="SkillLoop" sx={{ height: 28, width: 'auto' }} />
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {adminStrings.panelName}
      </Typography>
    </Box>
  );
}
