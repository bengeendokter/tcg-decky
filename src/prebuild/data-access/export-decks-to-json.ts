import * as fs from 'fs';
import type { Deck } from '../model/prebuild-deck.ts';

export interface ExportDecksParams {
	decks: Deck[];
	outputDirectory: string;
}

export function exportDecksToJson({
	decks,
	outputDirectory,
}: ExportDecksParams): void {
	decks.forEach((deck) => {
		const deckFileName = `${outputDirectory}/${deck.name}.json`;
		fs.writeFileSync(deckFileName, JSON.stringify(deck, null, 2), {
			encoding: 'utf-8',
		});
	});
}
