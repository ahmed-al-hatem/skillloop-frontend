import type { Components, Theme } from '@mui/material/styles';

/** Buttons and icon buttons: flat, brand radius. */
export const inputsCustomizations: Components<Theme> = {
  MuiButtonBase: {
    defaultProps: { disableRipple: true },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
};
