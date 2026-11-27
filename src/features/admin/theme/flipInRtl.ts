import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Mirrors a directional icon (arrows, chevrons) in RTL. The RTL plugin flips CSS,
 * not SVG drawings, so arrows need this: `<ArrowBackRoundedIcon sx={flipInRtl} />`.
 */
export const flipInRtl: SxProps<Theme> = (theme) =>
  theme.direction === 'rtl' ? { transform: 'scaleX(-1)' } : {};
