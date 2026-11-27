// MUI building blocks shared by the admin sections (admin-dashboard, admin-categories, …).
// Imported only from lazy admin pages, so MUI stays out of the member bundle.
// Never import this from src/app or a non-admin feature.
export { ChartCard, type ChartCardProps } from './components/ChartCard';
export { StatCard, type StatCardProps } from './components/StatCard';
