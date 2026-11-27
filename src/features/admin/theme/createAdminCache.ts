import createCache, { type EmotionCache } from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

export type Direction = 'rtl' | 'ltr';

/** Rules that must stay at the top level of the stylesheet (can't go inside a layer). */
const TOP_LEVEL_RULE = /^@(import|layer\s+[^{]*;?$)/;

/**
 * Emotion cache for the admin area. It does two things MUI can't do with one provider:
 *  1. RTL: `stylis-plugin-rtl` flips MUI's left/right styles when the page is RTL.
 *  2. Cascade layer: every compiled rule is put in `@layer mui`, so Tailwind and MUI
 *     never fight. The layer order is declared in src/styles/index.css.
 *
 * The layer is added at the sheet level, AFTER stylis has compiled (and flipped) the CSS.
 * Wrapping earlier, like MUI's `enableCssLayer` does, stops the RTL plugin from flipping.
 * (Emotion `<Global>` styles use their own sheet and stay unlayered — avoid them here.)
 */
export function createAdminCache(direction: Direction): EmotionCache {
  const cache = createCache({
    key: direction === 'rtl' ? 'mui-rtl' : 'mui',
    stylisPlugins: direction === 'rtl' ? [prefixer, rtlPlugin] : [prefixer],
  });

  const insertRule = cache.sheet.insert.bind(cache.sheet);
  cache.sheet.insert = (rule: string) =>
    insertRule(TOP_LEVEL_RULE.test(rule) ? rule : `@layer mui{${rule}}`);

  return cache;
}
