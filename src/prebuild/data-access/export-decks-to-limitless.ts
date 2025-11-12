import * as fs from 'fs';
import type { PrebuildDeck } from '../model/prebuild-deck.ts';

export interface ExportDecksToLimitlessParams {
	decks: PrebuildDeck[];
	outputDirectory: string;
}

export function exportDecksToLimitless({
	decks,
	outputDirectory,
}: ExportDecksToLimitlessParams): void {
	decks.forEach((deck) => {
		const deckFileName = `${outputDirectory}/${deck.name}.txt`;
		// TODO implement limitless export format when missing data is available
		// fs.writeFileSync(deckFileName, JSON.stringify(deck, null, 2), {
		// 	encoding: 'utf-8',
		// });
	});
}
