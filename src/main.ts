import * as fs from 'fs';
import { extractPrebuildDeck } from './prebuild/feature/extract-prebuild-deck.ts';
import type { Deck } from './prebuild/model/prebuild-deck.ts';

const CONFIG = {
	DEFAULT_OUTPUT_DIRECTORY: './output',
	MEGA_GENGAR_EX_DECK_URL:
		'https://bulbapedia.bulbagarden.net/wiki/Mega_Gengar_ex_Mega_Battle_Deck_(TCG)',
	DRAGAPULT_EX_DECK_URL:
		'https://bulbapedia.bulbagarden.net/wiki/Dragapult_ex_League_Battle_Deck_(TCG)',
	MARNIE_RIVAL_DECK_URL:
		'https://bulbapedia.bulbagarden.net/wiki/Marnie_Rival_Battle_Deck_(TCG)',
	BATTLE_ACADEMY_2024_DECKS_URL:
		'https://bulbapedia.bulbagarden.net/wiki/Battle_Academy_2024_(TCG)',
} as const satisfies Record<Uppercase<string>, string>;

const url: string = CONFIG.MEGA_GENGAR_EX_DECK_URL;
const decks: Deck[] = await extractPrebuildDeck(url);
const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;

decks.forEach((deck) => {
	const deckFileName = `${outputDirectory}/${deck.name}.json`;
	fs.writeFileSync(deckFileName, JSON.stringify(deck, null, 2), {
		encoding: 'utf-8',
	});
});
