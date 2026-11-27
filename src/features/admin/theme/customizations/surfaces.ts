import type { Components, Theme } from '@mui/material/styles';

/** Cards and the app bar: large radius, a hairline border, no shadows (dark dashboard look). */
export const surfacesCustomizations: Components<Theme> = {
  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: { backgroundImage: 'none' },
    },
  },
  MuiCard: {
    defaultProps: { variant: 'outlined' },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: theme.spacing(2.5),
        borderRadius: 20,
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.background.paper,
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
