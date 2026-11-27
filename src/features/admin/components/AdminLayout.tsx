import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useOutlet } from 'react-router';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { adminStrings } from '../strings';
import { AdminThemeProvider } from '../theme/AdminThemeProvider';
import { AppNavbar } from './AppNavbar';
import { Header } from './Header';
import { SideMenu } from './SideMenu';

/**
 * Shell of the admin area (MUI dashboard template): side menu, top bar on mobile,
 * header with breadcrumbs, and the current admin page. Loaded lazily from the router,
 * so MUI is never part of the member bundle.
 */
export function AdminLayout() {
  const outlet = useOutlet();

  return (
    <AdminThemeProvider>
      <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
        <SideMenu />
        <AppNavbar />
        <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack spacing={2} sx={{ mx: { xs: 2, md: 3 }, pb: 5, mt: { xs: 9, md: 0 } }}>
            <Header />
            <ErrorBoundary>
              {outlet ?? (
                <EmptyState
                  title={adminStrings.emptyTitle}
                  description={adminStrings.emptyDescription}
                />
              )}
            </ErrorBoundary>
          </Stack>
        </Box>
      </Box>
    </AdminThemeProvider>
  );
}
