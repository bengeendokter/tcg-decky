import { CONFIG } from '@config';
import { exportPaletteToJson } from '../data-access/export-palette-to-json';
import { getPalettePrimary, type Oklch, type PalettePrimary } from '../model/palette';

const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;

const THEME_COLOR = { l: 0.44, c: 0.16, h: 303.38 } as const satisfies Oklch;

const palette: PalettePrimary = getPalettePrimary(THEME_COLOR);

exportPaletteToJson({ palette, outputDirectory });
