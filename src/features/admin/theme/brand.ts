/**
 * Brand colors for the MUI theme, read from the CSS variables in src/styles/index.css.
 * That file stays the single source of truth: change a color there and both
 * the Tailwind UI and the admin area follow.
 */
function readCssVar(name: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!value) throw new Error(`Missing CSS variable ${name} (see src/styles/index.css).`);
  return value;
}

export function readBrand() {
  return {
    purple: readCssVar('--brand-purple'),
    lime: readCssVar('--brand-lime'),
    charcoal: readCssVar('--brand-charcoal'),
    white: readCssVar('--brand-white'),
  };
}

export type Brand = ReturnType<typeof readBrand>;
