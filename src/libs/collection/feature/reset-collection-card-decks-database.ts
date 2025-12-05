import type TCGdex from '@tcgdex/sdk';
import type { Db } from 'mongodb';
import { CONFIG } from '../../../config';
import { getTcgDex } from '../../tcg-dex/data-access/get-tcg-dex';
import { connectToDatabase } from '../data-access/connect-to-database';
import { importPrebuildDeckFromJson } from '../../prebuild/data-access/import-prebuild-deck-from-json';
import type { PrebuildDeck } from '../../prebuild/model/prebuild-deck';
import type { CollectionCardDeck } from '../model/collection-card';
import { convertPrebuildToCollectionCards } from './convert-prebuild-to-collection-cards';
import { closeDatabaseConnection } from '../data-access/close-database-connection';
import { addCollectionCardDeck } from '../data-access/add-collection-card-deck';
import { deleteAllCollectionCardDecks } from '../data-access/delete-all-collection-card-decks';

export interface ResetCollectionCardDecksDatabaseParams {
	mongoDbDatabaseUrl?: string;
	tcgDexServerUrl?: string;
}

export async function resetCollectionCardDecksDatabase(
	{
		mongoDbDatabaseUrl = CONFIG.MONGO_DB_DATABASE_URL,
		tcgDexServerUrl = CONFIG.TCG_DEX_SERVER_URL,
	}: ResetCollectionCardDecksDatabaseParams = {
		mongoDbDatabaseUrl: CONFIG.MONGO_DB_DATABASE_URL,
		tcgDexServerUrl: CONFIG.TCG_DEX_SERVER_URL,
	},
): Promise<void> {
	const db: Db = await connectToDatabase(mongoDbDatabaseUrl);
	const tcgDex: TCGdex = getTcgDex(tcgDexServerUrl);

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

	const collectionCardDecks: CollectionCardDeck[] = await Promise.all(
		prebuildDecks.map(async (prebuildDeck) => {
			return await convertPrebuildToCollectionCards({ prebuildDeck, tcgDex });
		}),
	);

	await deleteAllCollectionCardDecks(db);

	await Promise.all(
		collectionCardDecks.map(async (collectionCardDeck) => {
			return await addCollectionCardDeck({ db, collectionCardDeck });
		}),
	);

	await closeDatabaseConnection(db.client);
}
