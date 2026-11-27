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
      {/* data-theme: dark tokens for the Tailwind components inside (ErrorState, EmptyState…). */}
      <Box
        data-theme="admin-dark"
        sx={{
          display: 'flex',
          minHeight: '100dvh',
          bgcolor: 'background.default',
          color: 'text.primary',
        }}
      >
        <SideMenu />
        <AppNavbar />
        <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack spacing={3} sx={{ mx: { xs: 2, md: 4 }, pb: 5, mt: { xs: 9, md: 0 } }}>
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
