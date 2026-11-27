import type { Components, Theme } from '@mui/material/styles';

/** Chips as soft pills; skeletons on the dark surface. */
export const dataDisplayCustomizations: Components<Theme> = {
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 999, fontWeight: 600 },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      rounded: { borderRadius: 20 },
    },
  },
};
