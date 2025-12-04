import * as fs from 'fs';
import type { LimitlessDeck } from '../model/limitless-deck';
import { limitlessDeckToString } from '../feature/limitless-deck-to-string';

export interface ExportLimitlessDeckToTxtParams {
	limitlessDeck: LimitlessDeck;
	outputDirectory: string;
}

export function exportLimitlessDeckToTxt({
	limitlessDeck,
	outputDirectory,
}: ExportLimitlessDeckToTxtParams): void {
	const deckFileName = `${outputDirectory}/${limitlessDeck.name.replaceAll(' ', '_')}.txt`;

	const txtContent: string = limitlessDeckToString(limitlessDeck);

	fs.writeFileSync(deckFileName, txtContent, { encoding: 'utf-8' });
}
