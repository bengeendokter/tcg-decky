import { CONFIG } from '@config';

import { getPalettePrimary, type Oklch, type Palette } from '../model/palette';

const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;

const THEME_COLOR = { l: 0.44, c: 0.16, h: 303.38 } as const satisfies Oklch;

export function main() {
	const palette: Palette = getPalettePrimary(THEME_COLOR);

	console.log(palette);
}

// exportPaletteToJson({ palette, outputDirectory });
