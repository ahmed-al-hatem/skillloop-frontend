import Stack from '@mui/material/Stack';
import { NavbarBreadcrumbs } from './NavbarBreadcrumbs';

/**
 * Desktop header above every admin page. The template's search, date picker and
 * notifications are left out until the API has data for them.
 */
export function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: 1.5,
      }}
    >
      <NavbarBreadcrumbs />
    </Stack>
  );
}
