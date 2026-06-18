import { CONFIG } from '@config';

import {
	getFullPaletteCollection,
	getFullPaletteCollectionTokens,
	getPenpotFullPaletteCollectionTokens,
	type FullPaletteCollectionTokens,
	type Oklch,
} from '../model/palette';
import {
	exportFullPaletteCollectionTokensToJson,
	exportPenpotFullPaletteCollectionTokensToJson,
} from '../data-access/export-full-palette-collection-tokens-to-json';

export const PURPLE_THEME_COLOR = { l: 0.44, c: 0.16, h: 303.38 } as const satisfies Oklch;

export function getPaletteTokens(themeColor: Oklch = PURPLE_THEME_COLOR): FullPaletteCollectionTokens {
	const fullPaletteCollection = getFullPaletteCollection(themeColor);
	return getFullPaletteCollectionTokens(fullPaletteCollection);
}

export function exportPaletteTokens() {
	const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;
	const fullPaletteCollectionTokens = getPaletteTokens();

	exportFullPaletteCollectionTokensToJson({ fullPaletteCollectionTokens, outputDirectory });
}

export function exportPenpotPaletteTokens(themeColor: Oklch = PURPLE_THEME_COLOR) {
	const outputDirectory: string = `${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/penpot`;

	const fullPaletteCollection = getFullPaletteCollection(themeColor);
	const fullPaletteCollectionTokens = getPenpotFullPaletteCollectionTokens(fullPaletteCollection);

	exportPenpotFullPaletteCollectionTokensToJson({ fullPaletteCollectionTokens, outputDirectory });
}
