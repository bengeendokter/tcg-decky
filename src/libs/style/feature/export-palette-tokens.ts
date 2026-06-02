import { CONFIG } from '@config';

import {
	getFullPaletteCollection,
	getFullPaletteCollectionTokens,
	getPenpotFullPaletteCollectionTokens,
	type Oklch,
} from '../model/palette';
import {
	exportFullPaletteCollectionTokensToJson,
	exportPenpotFullPaletteCollectionTokensToJson,
} from '../data-access/export-full-palette-collection-tokens-to-json';

const THEME_COLOR = { l: 0.44, c: 0.16, h: 303.38 } as const satisfies Oklch;

export function exportPaletteTokens() {
	const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;

	const fullPaletteCollection = getFullPaletteCollection(THEME_COLOR);
	const fullPaletteCollectionTokens = getFullPaletteCollectionTokens(fullPaletteCollection);

	exportFullPaletteCollectionTokensToJson({ fullPaletteCollectionTokens, outputDirectory });
}

export function exportPenpotPaletteTokens() {
	const outputDirectory: string = `${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/penpot`;

	const fullPaletteCollection = getFullPaletteCollection(THEME_COLOR);
	const fullPaletteCollectionTokens = getPenpotFullPaletteCollectionTokens(fullPaletteCollection);

	exportPenpotFullPaletteCollectionTokensToJson({ fullPaletteCollectionTokens, outputDirectory });
}
