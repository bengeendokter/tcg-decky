import { CONFIG } from './config.ts';
import { exportPrebuildDecksToJson } from './prebuild/data-access/export-prebuild-decks-to-json.ts';
import { extractPrebuildDecks } from './prebuild/feature/extract-prebuild-deck.ts';
import type { PrebuildDeck } from './prebuild/model/prebuild-deck.ts';

export async function extractPrebuildDecksToJson(): Promise<void> {
	const outputDirectory: string = CONFIG.COLLECTION_OUTPUT_DIRECTORY;

	const battleAcademyDecksUrl: string =
		CONFIG.PREBUILD_DECKS_URL.BATTLE_ACADEMY_2024_DECKS;
	const dragapultDecksUrl: string = CONFIG.PREBUILD_DECKS_URL.DRAGAPULT_EX_DECK;
	const marnieDecksUrl: string = CONFIG.PREBUILD_DECKS_URL.MARNIE_RIVAL_DECK;
	const gengarDecksUrl: string = CONFIG.PREBUILD_DECKS_URL.MEGA_GENGAR_EX_DECK;

	const deckUrls = [
		battleAcademyDecksUrl,
		dragapultDecksUrl,
		marnieDecksUrl,
		gengarDecksUrl,
	] as const satisfies string[];

	const decks: PrebuildDeck[] = (
		await Promise.all(
			deckUrls.map(async (deckUrl) => {
				return await extractPrebuildDecks(deckUrl);
			}),
		)
	).reduce(
		(
			resultPrebuildDeckList: PrebuildDeck[],
			prebuildDeckList: PrebuildDeck[],
		) => {
			return resultPrebuildDeckList.concat(prebuildDeckList);
		},
		[],
	);

	exportPrebuildDecksToJson({ decks, outputDirectory });
}

await extractPrebuildDecksToJson();
