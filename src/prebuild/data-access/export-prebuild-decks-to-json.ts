import * as fs from 'fs';
import type { PrebuildDeck } from '../model/prebuild-deck.ts';

export interface ExportPrebuildDecksToJsonParams {
	decks: PrebuildDeck[];
	outputDirectory: string;
}

export function exportPrebuildDecksToJson({
	decks,
	outputDirectory,
}: ExportPrebuildDecksToJsonParams): void {
	decks.forEach((deck) => {
		const deckFileName = `${outputDirectory}/${deck.name}.json`;
		fs.writeFileSync(deckFileName, JSON.stringify(deck, null, 2), {
			encoding: 'utf-8',
		});
	});
}
