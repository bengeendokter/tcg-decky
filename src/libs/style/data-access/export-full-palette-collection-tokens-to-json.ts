import * as fs from 'fs';
import type { FullPaletteCollectionTokens } from '../model/palette';

export interface ExportPrebuildDecksToJsonParams {
	fullPaletteCollectionTokens: FullPaletteCollectionTokens;
	outputDirectory: string;
}

export function exportFullPaletteCollectionTokensToJson({
	fullPaletteCollectionTokens,
	outputDirectory,
}: ExportPrebuildDecksToJsonParams): void {
	const paletteFileName = `${outputDirectory}/palettes.tokens.json`;
	fs.writeFileSync(paletteFileName, JSON.stringify(fullPaletteCollectionTokens, null, 2), {
		encoding: 'utf-8',
	});
}
