import type { Components, Theme } from '@mui/material/styles';

/** Paper, cards and the app bar: flat with a thin border instead of shadows. */
export const surfacesCustomizations: Components<Theme> = {
  MuiPaper: {
    defaultProps: { elevation: 0 },
  },
  MuiCard: {
    defaultProps: { variant: 'outlined' },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(2),
        borderColor: theme.palette.divider,
      }),
    },
  },
  MuiAppBar: {
    defaultProps: { elevation: 0, color: 'inherit' },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
};
