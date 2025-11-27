import * as fs from 'fs';
import type { CollectionCardDeck } from '../model/collection-card.ts';

export interface ExportPrebuildDecksToJsonParams {
	deck: CollectionCardDeck;
	outputDirectory: string;
}

export function exportCollectionCardDeckToJson({
	deck,
	outputDirectory,
}: ExportPrebuildDecksToJsonParams): void {
	const deckFileName = `${outputDirectory}/${deck.name.replaceAll(' ', '_')}_collection.json`;
	fs.writeFileSync(deckFileName, JSON.stringify(deck, null, 2), {
		encoding: 'utf-8',
	});
}
