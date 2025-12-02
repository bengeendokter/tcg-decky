import type TCGdex from '@tcgdex/sdk';
import { CONFIG } from '../../config';
import { convertPrebuildToLimitlessDeck } from '../../libs/limitless/feature/convert-prebuild-to-limitless-deck';
import { importPrebuildDeckFromJson } from '../../libs/prebuild/data-access/import-prebuild-deck-from-json';
import type { PrebuildDeck } from '../../libs/prebuild/model/prebuild-deck';
import { getTcgDex } from '../../libs/tcg-dex/data-access/get-tcg-dex';
import type { LimitlessDeck } from '../../libs/limitless/model/limitless-deck';
import { exportLimitlessDeckToTxt } from '../../libs/limitless/data-access/export-limitless-deck-to-txt';

export async function convertPrebuildToLimitlessDeckTxt(): Promise<void> {
	const tcgDex: TCGdex = getTcgDex(CONFIG.TCG_DEX_SERVER_URL);
	const outputDirectory = CONFIG.LIMITLESS_OUTPUT_DIRECTORY;

	const armarougeDeckJsonPath: string = `${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_ARMAROUGE}`;
	const pikachuDeckJsonPath: string = `${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_PIKACHU}`;
	const darkraiDeckJsonPath: string = `${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_DARKRAI}`;
	const dragapultDeckJsonPath: string = `${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.DRAGAPULT_EX_DECK}`;
	const marnieDeckJsonPath: string = `${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.MARNIE_RIVAL_DECK}`;
	const gengarDeckJsonPath: string = `${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.MEGA_GENGAR_EX_DECK}`;

	const deckJsonPaths = [
		armarougeDeckJsonPath,
		pikachuDeckJsonPath,
		darkraiDeckJsonPath,
		dragapultDeckJsonPath,
		marnieDeckJsonPath,
		gengarDeckJsonPath,
	] as const satisfies string[];

	const prebuildDecks: PrebuildDeck[] = deckJsonPaths.map(
		importPrebuildDeckFromJson,
	);

	const limitlessDecks: LimitlessDeck[] = await Promise.all(
		prebuildDecks.map(async (prebuildDeck) => {
			return await convertPrebuildToLimitlessDeck({ prebuildDeck, tcgDex });
		}),
	);

	limitlessDecks.map((limitlessDeck) => {
		exportLimitlessDeckToTxt({ limitlessDeck, outputDirectory });
	});
}

await convertPrebuildToLimitlessDeckTxt();
