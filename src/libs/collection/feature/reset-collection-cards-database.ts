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

const ARMAROUGE_DECK_JSON_PATH =
	`${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_ARMAROUGE}` as const satisfies string;
const PIKACHU_DECK_JSON_PATH =
	`${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_PIKACHU}` as const satisfies string;
const DARKRAI_DECK_JSON_PATH =
	`${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_DARKRAI}` as const satisfies string;
const DRAGAPULT_DECK_JSON_PATH =
	`${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.DRAGAPULT_EX_DECK}` as const satisfies string;
const MARNIE_DECK_JSON_PATH =
	`${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.MARNIE_RIVAL_DECK}` as const satisfies string;
const GENGAR_DECK_JSON_PATH =
	`${CONFIG.COLLECTION_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.MEGA_GENGAR_EX_DECK}` as const satisfies string;

const DECK_JSON_PATHS = [
	ARMAROUGE_DECK_JSON_PATH,
	PIKACHU_DECK_JSON_PATH,
	DARKRAI_DECK_JSON_PATH,
	DRAGAPULT_DECK_JSON_PATH,
	MARNIE_DECK_JSON_PATH,
	GENGAR_DECK_JSON_PATH,
] as const satisfies string[];

export interface ResetCollectionCardsDatabaseParams {
	mongoDbDatabaseUrl?: string;
	tcgDexServerUrl?: string;
	dittoDexCards?: DittoDexCard[];
	prebuildDecks?: PrebuildDeck[];
}

const defaultResetCollectionCardsDatabaseParams: Required<ResetCollectionCardsDatabaseParams> =
	{
		mongoDbDatabaseUrl: CONFIG.MONGO_DB_DATABASE_URL,
		tcgDexServerUrl: CONFIG.TCG_DEX_SERVER_URL,
		dittoDexCards: importDittoDexCardsFromCsv(CONFIG.DITTO_DEX_SCV_FILE_PATH),
		prebuildDecks: DECK_JSON_PATHS.map(importPrebuildDeckFromJson),
	};

export async function resetCollectionCardsDatabase({
	mongoDbDatabaseUrl = defaultResetCollectionCardsDatabaseParams.mongoDbDatabaseUrl,
	tcgDexServerUrl = defaultResetCollectionCardsDatabaseParams.tcgDexServerUrl,
	dittoDexCards = defaultResetCollectionCardsDatabaseParams.dittoDexCards,
	prebuildDecks = defaultResetCollectionCardsDatabaseParams.prebuildDecks,
}: ResetCollectionCardsDatabaseParams = defaultResetCollectionCardsDatabaseParams): Promise<void> {
	const tcgDex: TCGdex = getTcgDex(tcgDexServerUrl);

	const collectionCards: CollectionCard[] = await combineCardsToCollection({
		dittoDexCards,
		prebuildDecks,
		tcgDex,
	});

	await setCollectioncardsToDatabase({ collectionCards, mongoDbDatabaseUrl });
}

interface SetCollectioncardsToDatabaseParams {
	collectionCards: CollectionCard[];
	mongoDbDatabaseUrl: string;
}

export async function setCollectioncardsToDatabase({
	collectionCards,
	mongoDbDatabaseUrl,
}: SetCollectioncardsToDatabaseParams): Promise<void> {
	const db: Db = await connectToDatabase(mongoDbDatabaseUrl);

	await deleteAllCollectionCard(db);

	await Promise.all(
		collectionCards.map(async (collectionCard) => {
			return await addCollectionCard({ db, collectionCard });
		}),
	);

	await closeDatabaseConnection(db.client);
}

interface CombineCardsToCollectionParams {
	dittoDexCards: DittoDexCard[];
	prebuildDecks: PrebuildDeck[];
	tcgDex: TCGdex;
}

export async function combineCardsToCollection({
	dittoDexCards,
	prebuildDecks,
	tcgDex,
}: CombineCardsToCollectionParams): Promise<CollectionCard[]> {
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

	return [...dittoDexCollectionCards, ...collectionCardDeckCards];
}
