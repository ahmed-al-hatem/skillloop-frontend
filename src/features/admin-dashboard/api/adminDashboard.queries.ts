import { useQuery } from '@tanstack/react-query';
import { getAdminDashboard } from './adminDashboard.api';

export const adminDashboardKeys = {
  all: ['admin', 'dashboard'] as const,
};

export const useAdminDashboard = () =>
  useQuery({ queryKey: adminDashboardKeys.all, queryFn: getAdminDashboard });
