import * as fs from 'fs';
import type {
	FullPaletteCollectionTokens,
	PenpotFullPaletteCollectionTokens,
} from '../model/palette';

export interface ExportPrebuildDecksToJsonParams {
	fullPaletteCollectionTokens: FullPaletteCollectionTokens | PenpotFullPaletteCollectionTokens;
	outputDirectory: string;
}

export function exportFullPaletteCollectionTokensToJson({
	fullPaletteCollectionTokens,
	outputDirectory,
}: ExportPrebuildDecksToJsonParams): void {
	const paletteFileName = `${outputDirectory}/palette.tokens.json`;
	fs.writeFileSync(paletteFileName, JSON.stringify(fullPaletteCollectionTokens, null, 2), {
		encoding: 'utf-8',
	});
}

export function exportPenpotFullPaletteCollectionTokensToJson({
	fullPaletteCollectionTokens,
	outputDirectory,
}: ExportPrebuildDecksToJsonParams): void {
	const paletteFileName = `${outputDirectory}/palette.json`;
	fs.writeFileSync(paletteFileName, JSON.stringify(fullPaletteCollectionTokens, null, 2), {
		encoding: 'utf-8',
	});
}

export interface ExportObjectToJsonParams {
	object: unknown;
	destination: string;
}

export function exportObjectToJson({ object, destination }: ExportObjectToJsonParams): void {
	fs.writeFileSync(destination, JSON.stringify(object, null, 2), {
		encoding: 'utf-8',
	});
}
