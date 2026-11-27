import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { AdminBrand } from './AdminBrand';
import { BackToSiteLink } from './BackToSiteLink';
import { MenuContent } from './MenuContent';

export const SIDE_MENU_WIDTH = 240;

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
      <Box sx={{ p: 2 }}>
        <AdminBrand />
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <MenuContent />
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}>
        <BackToSiteLink />
      </Box>
    </Drawer>
  );
}
