import * as fs from 'fs';
import {
	collectionCardDeckValidator,
	type CollectionCardDeck,
} from '../model/collection-card.ts';

export function importCollectionCardDeckFromJson(
	jsonFilePath: string,
): CollectionCardDeck {
	const jsonContent: string = fs.readFileSync(jsonFilePath, {
		encoding: 'utf-8',
	});

	const json: unknown = JSON.parse(jsonContent);

	if (typeof json !== 'object' || json === null) {
		throw Error('JSON is not an object');
	}

	if (!collectionCardDeckValidator.allows(json)) {
		throw Error('JSON is not a CollectionCardDeck');
	}

	return json;
}
