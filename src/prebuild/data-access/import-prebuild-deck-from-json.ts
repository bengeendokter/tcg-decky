import * as fs from 'fs';
import { isPrebuildDeck, type PrebuildDeck } from '../model/prebuild-deck.ts';

export function importPrebuildDeckFromJson(jsonFilePath: string): PrebuildDeck {
	const jsonContent: string = fs.readFileSync(jsonFilePath, {
		encoding: 'utf-8',
	});

	const json: unknown = JSON.parse(jsonContent);

	if (typeof json !== 'object' || json === null) {
		throw Error('JSON is not an object');
	}

	if(!isPrebuildDeck(json)) {
		throw Error('JSON is not a PrebuildDeck');
	}

	return json;
}
