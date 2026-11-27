import { alpha, type Components, type Theme } from '@mui/material/styles';

/** Side menu items and drawers. */
export const navigationCustomizations: Components<Theme> = {
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(0.5),
        '&.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
          '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.14) },
        },
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: { minWidth: 36 },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      primary: { fontWeight: 500 },
    },
  },
};
