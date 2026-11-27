// MUI building blocks shared by the admin sections (admin-dashboard, admin-categories, …).
// Imported only from lazy admin pages, so MUI stays out of the member bundle.
// Never import this from src/app or a non-admin feature.
export { LegendItem, type LegendItemProps } from './components/LegendItem';
export { MetricItem, type MetricItemProps } from './components/MetricItem';
export { SectionCard, type SectionCardProps } from './components/SectionCard';
