type Id = string | number;

const ADMIN = '/admin';

/**
 * Every URL in the app. Use these instead of hard-coded strings in links and navigate().
 * Detail pages are builders: `ROUTES.admin.dispute(id)` for links, `ROUTES.admin.dispute(':id')`
 * for the route definition.
 */
export const ROUTES = {
  home: '/',
  /** No login screen yet (no design); the guard already sends signed-out users here. */
  login: '/login',
  admin: {
    root: ADMIN,
    sessionExpired: `${ADMIN}/session-expired`,
    disputes: `${ADMIN}/disputes`,
    dispute: (id: Id) => `${ADMIN}/disputes/${id}`,
    members: `${ADMIN}/members`,
    member: (id: Id) => `${ADMIN}/members/${id}`,
    bookings: `${ADMIN}/bookings`,
    booking: (id: Id) => `${ADMIN}/bookings/${id}`,
    services: `${ADMIN}/services`,
    categories: `${ADMIN}/categories`,
    categorySuggestions: `${ADMIN}/category-suggestions`,
    settings: `${ADMIN}/settings`,
  },
} as const;
