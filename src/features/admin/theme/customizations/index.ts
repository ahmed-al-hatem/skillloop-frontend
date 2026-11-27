import type { Components, Theme } from '@mui/material/styles';
import { inputsCustomizations } from './inputs';
import { navigationCustomizations } from './navigation';
import { surfacesCustomizations } from './surfaces';

/**
 * All component overrides. Add a new group (e.g. `charts.ts`, `dataGrid.ts`) as its own
 * file and spread it here.
 */
export const adminComponents: Components<Theme> = {
  ...inputsCustomizations,
  ...navigationCustomizations,
  ...surfacesCustomizations,
};
