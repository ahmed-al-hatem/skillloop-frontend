// Public API of the admin core (shell). Other code imports ONLY from '@/admin-features/core'.
export {
  adminNav,
  adminNavGroups,
  type AdminNavBadge,
  type AdminNavGroup,
  type AdminNavIcon,
  type AdminNavItem,
  type AdminNavPhase,
} from './nav.config';
export { adminRoutes, type AdminRouteHandle } from './routes';
