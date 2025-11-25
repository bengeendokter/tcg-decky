import type { Db } from 'mongodb';
import { connectToDatabase } from './collection/data-access/connect-to-database.ts';
import { CONFIG } from './config.ts';
import { closeDatabaseConnection } from './collection/data-access/close-database-connection.ts';
import { deleteAllCollectionCard } from './collection/data-access/delete-all-collection-cards.ts';
import { importDittoDexCardsFromCsv } from './ditto-dex/data-access/import-ditto-dex-cards-from-csv.ts';
import type { DittoDexCard } from './ditto-dex/model/ditto-dex-card.ts';
import { convetDittoDexCardsToCollectionCards } from './collection/feature/convert-ditto-dex-cards-to-collection-cards.ts';
import { getTcgDex } from './tcg-dex/data-access/get-tcg-dex.ts';
import type TCGdex from '@tcgdex/sdk';
import type {
	CollectionCard,
	CollectionCardDeck,
} from './collection/model/collection-card.ts';
import { importPrebuildDeckFromJson } from './prebuild/data-access/import-prebuild-deck-from-json.ts';
import type { PrebuildDeck } from './prebuild/model/prebuild-deck.ts';
import { convertPrebuildToCollectionCards } from './collection/feature/convert-prebuild-to-collection-cards.ts';
import { addCollectionCard } from './collection/data-access/add-collection-card.ts';

export async function resetCollectionCardsDatabase(): Promise<void> {
	const db: Db = await connectToDatabase(CONFIG.MONGO_DB_DATABASE_URL);
	const tcgDex: TCGdex = getTcgDex(CONFIG.TCG_DEX_SERVER_URL);

	const dittoDexCards: DittoDexCard[] = importDittoDexCardsFromCsv(
		CONFIG.DITTO_DEX_SCV_FILE_PATH,
	);

	const armarougeDeckJsonPath: string = `${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_ARMAROUGE}`;
	const pikachuDeckJsonPath: string = `${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_PIKACHU}`;
	const darkraiDeckJsonPath: string = `${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_DARKRAI}`;
	const dragapultDeckJsonPath: string = `${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.DRAGAPULT_EX_DECK}`;
	const marnieDeckJsonPath: string = `${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.MARNIE_RIVAL_DECK}`;
	const gengarDeckJsonPath: string = `${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.MEGA_GENGAR_EX_DECK}`;

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

await resetCollectionCardsDatabase();
