import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import { AdminBrand } from './AdminBrand';
import { BackToSiteLink } from './BackToSiteLink';
import { MenuContent } from './MenuContent';

export type SideMenuMobileProps = {
  open: boolean;
  onClose: () => void;
};

/** Side menu as a drawer on small screens. `anchor="left"` is flipped to the start side in RTL. */
export function SideMenuMobile({ open, onClose }: SideMenuMobileProps) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{ [`& .${drawerClasses.paper}`]: { width: 260, maxWidth: '80dvw' } }}
    >
      <Box sx={{ p: 2 }}>
        <AdminBrand />
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1 }}>
        <MenuContent onNavigate={onClose} />
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}>
        <BackToSiteLink />
      </Box>
    </Drawer>
  );
}
