import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import type { SvgIconComponent } from '@mui/icons-material';
import { ROUTES } from '@/shared/constants/routes';
import { adminStrings } from '../strings';

export type AdminNavItem = {
  key: string;
  label: string;
  to: string;
  icon: SvgIconComponent;
  /** Match the path exactly (true for the admin home). */
  end?: boolean;
};

/**
 * The admin side menu. When a new admin section is built (e.g. categories, disputes),
 * add ONE item here and its routes in src/app/router.tsx. Only list sections that exist.
 */
export const ADMIN_NAV: AdminNavItem[] = [
  {
    key: 'dashboard',
    label: adminStrings.nav.dashboard,
    to: ROUTES.admin.root,
    icon: SpaceDashboardRoundedIcon,
    end: true,
  },
];
