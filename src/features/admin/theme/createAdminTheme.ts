import { alpha, createTheme, type Theme } from '@mui/material/styles';
import { readBrand } from './brand';
import type { Direction } from './createAdminCache';
import { adminComponents } from './customizations';

/**
 * MUI theme for the admin area, built from the SkillLoop brand (design/README.md).
 * Component overrides live in ./customizations — one file per group, like the MUI template.
 */
export function createAdminTheme(direction: Direction): Theme {
  const brand = readBrand();

  return createTheme({
    direction,
    palette: {
      mode: 'light',
      primary: { main: brand.purple, contrastText: brand.white },
      secondary: { main: brand.lime, contrastText: brand.charcoal },
      text: {
        primary: brand.charcoal,
        secondary: alpha(brand.charcoal, 0.72),
      },
      background: {
        default: alpha(brand.charcoal, 0.03),
        paper: brand.white,
      },
      divider: alpha(brand.charcoal, 0.12),
    },
    shape: { borderRadius: 10 },
    typography: {
      // Same font stack as Tailwind's `font-sans` (Noto Sans Arabic first).
      fontFamily: 'var(--font-sans)',
      h4: { fontWeight: 700, fontSize: '1.5rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: adminComponents,
  });
}
