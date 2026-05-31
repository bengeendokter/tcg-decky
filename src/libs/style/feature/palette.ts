import { CONFIG } from '@config';

import {
	getFullPaletteCollection,
	getFullPaletteCollectionTokens,
	type Oklch,
} from '../model/palette';
import { exportFullPaletteCollectionTokensToJson } from '../data-access/export-full-palette-collection-tokens-to-json';

const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;

const THEME_COLOR = { l: 0.44, c: 0.16, h: 303.38 } as const satisfies Oklch;

export function exportPaletteTokes() {
	const fullPaletteCollection = getFullPaletteCollection(THEME_COLOR);
	const fullPaletteCollectionTokens = getFullPaletteCollectionTokens(fullPaletteCollection);

	exportFullPaletteCollectionTokensToJson({ fullPaletteCollectionTokens, outputDirectory });
}
