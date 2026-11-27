import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router';
import { ADMIN_NAV } from '../config/navigation';
import { useActiveNavItem } from '../hooks/useActiveNavItem';

export type MenuContentProps = {
  /** Called after a link is clicked (closes the mobile drawer). */
  onNavigate?: () => void;
};

/** The list of admin sections, built from ADMIN_NAV. */
export function MenuContent({ onNavigate }: MenuContentProps) {
  const active = useActiveNavItem();

  return (
    <List dense sx={{ p: 1 }}>
      {ADMIN_NAV.map(({ key, label, to, icon: Icon }) => (
        <ListItem key={key} disablePadding>
          <ListItemButton
            component={Link}
            to={to}
            selected={active?.key === key}
            onClick={onNavigate}
          >
            <ListItemIcon>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
