import type { Components, Theme } from '@mui/material/styles';

/** Side menu: dark drawer, pill items, the active one filled. */
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
        borderRadius: 999,
        minHeight: 44,
        marginBottom: theme.spacing(0.5),
        color: theme.palette.text.secondary,
        '& .MuiListItemIcon-root': { color: 'inherit' },
        '&:hover': { color: theme.palette.text.primary },
        '&.Mui-selected': {
          backgroundColor: theme.palette.action.selected,
          color: theme.palette.text.primary,
          '& .MuiListItemIcon-root': { color: theme.palette.secondary.main },
          '&:hover': { backgroundColor: theme.palette.action.selected },
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
      primary: { fontWeight: 600 },
    },
  },
  MuiBreadcrumbs: {
    styleOverrides: {
      separator: ({ theme }) => ({ color: theme.palette.text.disabled }),
    },
  },
};
