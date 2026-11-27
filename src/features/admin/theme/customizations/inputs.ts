import type { Components, Theme } from '@mui/material/styles';

/** Pill buttons and round icon buttons. */
export const inputsCustomizations: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: { disableRipple: true },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: { borderRadius: 999, paddingInline: 16 },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 999,
        backgroundColor: theme.palette.action.hover,
      }),
    },
  },
};
