# SkillLoop brand

**English** · [العربية](README.ar.md)

The brand identity and how to use it in the frontend. The designer's original files are in [`source/`](source/). Don't edit them. Ask the designer for a new version instead.

## Colors

| Name     | Hex       | Token                                         | Use it for                                     |
| -------- | --------- | --------------------------------------------- | ---------------------------------------------- |
| Purple   | `#8038FF` | `primary`, `ring`                             | Main buttons, links, focus ring, active states |
| Lime     | `#B8ED50` | `secondary`                                   | Secondary buttons, highlights, badges          |
| Charcoal | `#2D2B35` | `foreground`, `secondary-foreground`          | Text, dark surfaces (header/footer, hero)      |
| White    | `#FFFFFF` | `background`, `card`, `primary-foreground`    | Page background, cards, text on purple         |
| Navy     | `#0B2349` | `background` inside `data-theme="admin-dark"` | Dark surfaces: the admin panel background      |

The admin panel is dark: `data-theme="admin-dark"` (in `index.css`) remaps the tokens to navy surfaces with white text, and the MUI theme uses the same colors. Navy shades from the brand board: `#0B2349` `#163F80` `#1F4C94` `#275DB3` `#3D78D7`.

These derived tokens are mixed from the brand colors in [`src/styles/index.css`](../src/styles/index.css): `muted` (charcoal 4%), `muted-foreground` (charcoal 72%), `accent` (purple 8%, for hover backgrounds), `border` (charcoal 12%), `input` (charcoal 16%). `destructive` (red) is not a brand color but is kept for errors.

**Rules**

- In components, use token classes like `bg-primary`, `text-foreground` and `bg-secondary`. Never write hex values. For marketing or illustrations only, `bg-brand-purple`, `bg-brand-lime` and `bg-brand-charcoal` also exist.
- **Never use lime for text on white.** The contrast is about 1.4:1, which is unreadable. Use lime as a **background** with charcoal text (about 10:1).
- White on purple is about 5.4:1 and passes WCAG AA for normal text. Charcoal on white is about 14:1.
- To change a color, edit only the `--brand-*` variables in `index.css`. Every other token updates on its own.

## Fonts

| Font                  | Script                   | Package                                 |
| --------------------- | ------------------------ | --------------------------------------- |
| Noto Sans Arabic (UI) | Arabic, the main UI font | `@fontsource-variable/noto-sans-arabic` |
| Noto Sans             | Latin and other scripts  | `@fontsource-variable/noto-sans`        |

- The fonts are **self-hosted** through npm. Nothing loads from Google, so the app works offline and sends no data to third parties. They are variable fonts, so every weight from 100 to 900 is available (`font-normal`, `font-medium`, `font-semibold`, `font-bold`…).
- Only the parts the page needs are downloaded (`unicode-range`). Arabic-only text does not load the Latin file.
- **About "UI":** Noto Sans Arabic **UI** is the same design with tighter line height. Google and Fontsource no longer publish it separately; it was merged into Noto Sans Arabic. If line height feels too loose in buttons or inputs, use `leading-tight` or `leading-snug`.
- Already set as `font-sans` (the default for `body`). You don't need to add anything.

## Logo

### In the app: `src/shared/assets/brand/`

| File                  | Background                  | Colors                 |
| --------------------- | --------------------------- | ---------------------- |
| `logo-on-light.svg`   | White or light              | Charcoal + purple      |
| `logo-on-dark.svg`    | Charcoal or dark            | White + purple         |
| `logo-on-primary.svg` | Purple                      | White + charcoal       |
| `logo-mono-black.svg` | Single-color printing       | Black                  |
| `logo-mono-white.svg` | Photo or busy background    | White                  |
| `app-icon.svg`        | Square icon (the two loops) | Charcoal tile + purple |

The wordmark SVGs are cropped tight with a small clear space. Use them as images, which Vite turns into URLs:

```tsx
import logoUrl from '@/shared/assets/brand/logo-on-light.svg';

<img src={logoUrl} alt="SkillLoop" className="h-8 w-auto" />;
```

- Set **only the height** (`h-6` to `h-10` in the header) and keep `w-auto` so the logo is never stretched.
- The logo is a Latin wordmark. Don't mirror or flip it in RTL.
- Minimum height is 20px. Below that, use `app-icon.svg`.
- Don't recolor the logo with CSS. Use one of the variants above.

### In the browser and on phones: `public/`

| File                    | Size         | Used for                                            |
| ----------------------- | ------------ | --------------------------------------------------- |
| `favicon.svg`           | vector       | Browser tab (modern browsers)                       |
| `favicon.ico`           | 16 / 32 / 48 | Browser tab (older browsers, Windows)               |
| `apple-touch-icon.png`  | 180×180      | iPhone/iPad home screen (full charcoal background)  |
| `icon-192.png`          | 192×192      | Android / PWA                                       |
| `icon-512.png`          | 512×512      | Android / PWA, splash screen                        |
| `icon-maskable-512.png` | 512×512      | Android adaptive icon (safe zone 80%)               |
| `og-image.png`          | 1200×630     | Link preview (WhatsApp, X, Facebook, Slack…)        |
| `site.webmanifest`      | —            | App name, colors and icons for "Add to home screen" |

All of them are linked from `index.html`.

## Source files: `design/source/`

| File                        | What it is                                          |
| --------------------------- | --------------------------------------------------- |
| `skillloop-brand.ai`        | Illustrator master file                             |
| `brand-board.png`           | The full brand board (palette + every logo variant) |
| `brand-board-01/02.svg`     | The same board as SVG                               |
| `logo-light-background.svg` | Original wordmark for light backgrounds             |
| `logo-dark-background.svg`  | Original wordmark for dark backgrounds              |
| `app-icon.svg`              | Original app icon                                   |

The files in `src/shared/assets/brand/` and `public/` were exported from these: tight crop, fills written directly instead of CSS classes so several logos on one page don't clash, and square icon sizes. When the designer sends a new logo, replace the source files and export again.
