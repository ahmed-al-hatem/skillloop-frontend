// Public API of the admin shell. Other code imports ONLY from '@/features/admin'.
// Admin sections live in their own features (admin-dashboard, admin-categories, …) and are
// nested under `adminRoute` in src/app/router.tsx.
// Keep this file free of MUI exports: the router imports it eagerly, so anything exported
// here lands in the member bundle. Shared MUI building blocks go in '@/features/admin-ui'.
export { adminRoute } from './routes';
