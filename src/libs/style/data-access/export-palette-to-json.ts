import * as fs from 'fs';
import type { Palette } from '../model/palette';

export interface ExportPrebuildDecksToJsonParams {
	palette: Palette;
	outputDirectory: string;
}

export function exportPaletteToJson({
	palette,
	outputDirectory,
}: ExportPrebuildDecksToJsonParams): void {
	const paletteFileName = `${outputDirectory}/palette.tokens.json`;
	fs.writeFileSync(paletteFileName, JSON.stringify(palette, null, 2), {
		encoding: 'utf-8',
	});
}
