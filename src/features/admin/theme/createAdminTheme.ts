import { alpha, createTheme, darken, type Theme } from '@mui/material/styles';
import { readBrand } from './brand';
import type { Direction } from './createAdminCache';
import { adminComponents } from './customizations';

/**
 * Dark MUI theme for the admin area, built from the SkillLoop brand (design/README.md):
 * navy page, darker navy cards and side menu, white text, purple primary, lime highlights.
 * Matches the `data-theme="admin-dark"` tokens in src/styles/index.css (used by Tailwind
 * components like ErrorState inside the admin area).
 * Component overrides live in ./customizations — one file per group, like the MUI template.
 */
export function createAdminTheme(direction: Direction): Theme {
  const brand = readBrand();
  const surface = darken(brand.navy, 0.3);

  return createTheme({
    direction,
    palette: {
      mode: 'dark',
      primary: { main: brand.purple, contrastText: brand.white },
      secondary: { main: brand.lime, contrastText: brand.charcoal },
      text: {
        primary: brand.white,
        secondary: alpha(brand.white, 0.64),
        disabled: alpha(brand.white, 0.38),
      },
      background: {
        default: brand.navy,
        paper: surface,
      },
      divider: alpha(brand.white, 0.08),
      action: {
        hover: alpha(brand.white, 0.06),
        selected: alpha(brand.white, 0.1),
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      // Same font stack as Tailwind's `font-sans` (Noto Sans Arabic first).
      fontFamily: 'var(--font-sans)',
      h3: { fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2 },
      h4: { fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.3 },
      h6: { fontWeight: 600, fontSize: '1rem' },
      subtitle1: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: adminComponents,
  });
}
