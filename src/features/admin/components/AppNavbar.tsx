import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import { adminStrings } from '../strings';
import { AdminBrand } from './AdminBrand';
import { SideMenuMobile } from './SideMenuMobile';

/** Top bar on small screens only (below md): brand + button that opens the side menu. */
export function AppNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <AppBar position="fixed" sx={{ display: { xs: 'block', md: 'none' } }}>
      <Toolbar sx={{ justifyContent: 'space-between', gap: 1 }}>
        <AdminBrand />
        <IconButton size="small" aria-label={adminStrings.openMenu} onClick={() => setOpen(true)}>
          <MenuRoundedIcon />
        </IconButton>
      </Toolbar>
      <SideMenuMobile open={open} onClose={() => setOpen(false)} />
    </AppBar>
  );
}
