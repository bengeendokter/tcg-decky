import type { Db } from 'mongodb';
import { connectToDatabase } from '../data-access/connect-to-database';
import { CONFIG } from '../../../config';
import { closeDatabaseConnection } from '../data-access/close-database-connection';
import { deleteAllCollectionCard } from '../data-access/delete-all-collection-cards';
import { importDittoDexCardsFromCsv } from '../../ditto-dex/data-access/import-ditto-dex-cards-from-csv';
import type { DittoDexCard } from '../../ditto-dex/model/ditto-dex-card';
import { convetDittoDexCardsToCollectionCards } from '../feature/convert-ditto-dex-cards-to-collection-cards';
import { getTcgDex } from '../../tcg-dex/data-access/get-tcg-dex';
import type TCGdex from '@tcgdex/sdk';
import type {
	CollectionCard,
	CollectionCardDeck,
} from '../model/collection-card';
import { importPrebuildDeckFromJson } from '../../prebuild/data-access/import-prebuild-deck-from-json';
import type { PrebuildDeck } from '../../prebuild/model/prebuild-deck';
import { convertPrebuildToCollectionCards } from '../feature/convert-prebuild-to-collection-cards';
import { addCollectionCard } from '../data-access/add-collection-card';

export interface ResetCollectionCardsDatabaseParams {
	mongoDbDatabaseUrl?: string;
	tcgDexServerUrl?: string;
}

export async function resetCollectionCardsDatabase(
	{
		mongoDbDatabaseUrl = CONFIG.MONGO_DB_DATABASE_URL,
		tcgDexServerUrl = CONFIG.TCG_DEX_SERVER_URL,
	}: ResetCollectionCardsDatabaseParams = {
		mongoDbDatabaseUrl: CONFIG.MONGO_DB_DATABASE_URL,
		tcgDexServerUrl: CONFIG.TCG_DEX_SERVER_URL,
	},
): Promise<void> {
	const db: Db = await connectToDatabase(mongoDbDatabaseUrl);
	const tcgDex: TCGdex = getTcgDex(tcgDexServerUrl);

	const dittoDexCards: DittoDexCard[] = importDittoDexCardsFromCsv(
		CONFIG.DITTO_DEX_SCV_FILE_PATH,
	);

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

	const collectionCardDeckCards: CollectionCard[] = collectionCardDecks.reduce(
		(
			collectionCardDeckCards: CollectionCard[],
			collectionCardDeck: CollectionCardDeck,
		) => {
			return collectionCardDeckCards.concat(collectionCardDeck.cards);
		},
		[],
	);

	const dittoDexCollectionCards: CollectionCard[] =
		await convetDittoDexCardsToCollectionCards({ dittoDexCards, tcgDex });

	const collectionCards: CollectionCard[] = [
		...dittoDexCollectionCards,
		...collectionCardDeckCards,
	];

	await deleteAllCollectionCard(db);

	await Promise.all(
		collectionCards.map(async (collectionCard) => {
			return await addCollectionCard({ db, collectionCard });
		}),
	);

	await closeDatabaseConnection(db.client);
}
