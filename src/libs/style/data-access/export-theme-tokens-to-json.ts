import * as fs from 'fs';
import type { ThemeTokens } from '../model/theme';

export interface ExportPrebuildDecksToJsonParams {
	themeTokens: ThemeTokens;
	outputDirectory: string;
	name: string;
}

export function exportThemeTokensToJson({
	themeTokens,
	outputDirectory,
	name,
}: ExportPrebuildDecksToJsonParams): void {
	const paletteFileName = `${outputDirectory}/${name}.tokens.json`;
	fs.writeFileSync(paletteFileName, JSON.stringify(themeTokens, null, 2), {
		encoding: 'utf-8',
	});
}

export function exportPenpotThemeTokensToJson({
	themeTokens,
	outputDirectory,
	name,
}: ExportPrebuildDecksToJsonParams): void {
	const paletteFileName = `${outputDirectory}/${name}.json`;
	fs.writeFileSync(paletteFileName, JSON.stringify(themeTokens, null, 2), {
		encoding: 'utf-8',
	});
}
