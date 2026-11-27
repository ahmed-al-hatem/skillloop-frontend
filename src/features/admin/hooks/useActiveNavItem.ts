import { matchPath, useLocation } from 'react-router';
import { ADMIN_NAV, type AdminNavItem } from '../config/navigation';

/** The side-menu item that matches the current URL (used by the menu and the breadcrumbs). */
export function useActiveNavItem(): AdminNavItem | undefined {
  const { pathname } = useLocation();
  return ADMIN_NAV.find((item) => matchPath({ path: item.to, end: item.end ?? false }, pathname));
}
