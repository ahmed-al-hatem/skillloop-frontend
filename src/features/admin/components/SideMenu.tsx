import Box from '@mui/material/Box';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { AdminBrand } from './AdminBrand';
import { BackToSiteLink } from './BackToSiteLink';
import { MenuContent } from './MenuContent';

export const SIDE_MENU_WIDTH = 256;

/** Permanent side menu on desktop (md and up). On mobile, AppNavbar opens SideMenuMobile. */
export function SideMenu() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: SIDE_MENU_WIDTH,
        flexShrink: 0,
        [`& .${drawerClasses.paper}`]: { width: SIDE_MENU_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <AdminBrand />
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
        <MenuContent />
      </Box>
      <Box sx={{ p: 2 }}>
        <BackToSiteLink />
      </Box>
    </Drawer>
  );
}
