import { extractPrebuildDecks } from './prebuild/feature/extract-prebuild-deck.ts';
import type { PrebuildDeck } from './prebuild/model/prebuild-deck.ts';
import { exportPrebuildDecksToJson } from './prebuild/data-access/export-prebuild-decks-to-json.ts';
import { convertPrebuildToLimitlessDeck } from './limitless/feature/convert-prebuild-to-limitless-deck.ts';
import type { LimitlessDeck } from './limitless/model/limitless-deck.ts';
import { exportLimitlessDeckToTxt } from "./limitless/data-access/export-limitless-deck-to-txt.ts";

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

const url: string = CONFIG.MARNIE_RIVAL_DECK_URL;
const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;

const decks: PrebuildDeck[] = await extractPrebuildDecks(url);
// exportPrebuildDecksToJson({ decks, outputDirectory });
decks.forEach(async (deck) => {
	const limitlessDeck: LimitlessDeck = await convertPrebuildToLimitlessDeck(deck);
	exportLimitlessDeckToTxt({limitlessDeck, outputDirectory});
});
