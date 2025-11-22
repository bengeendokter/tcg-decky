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
	console.log('Connect to database and tcgdex');
	const db: Db = await connectToDatabase(CONFIG.MONGO_DB_DATABASE_URL);
	const tcgDex: TCGdex = getTcgDex(CONFIG.TCG_DEX_SERVER_URL);

	console.log('Import dittodex collection');
	const dittoDexCards: DittoDexCard[] = importDittoDexCardsFromCsv(
		CONFIG.DITTO_DEX_SCV_FILE_PATH,
	);

	console.log('Import prebuild decks');
	const armarougeDeck: PrebuildDeck = importPrebuildDeckFromJson(
		`${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_ARMAROUGE}`,
	);

	const pikachuDeck: PrebuildDeck = importPrebuildDeckFromJson(
		`${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_PIKACHU}`,
	);

	const darkraiDeck: PrebuildDeck = importPrebuildDeckFromJson(
		`${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.BATTLE_ACADEMY_2024_DARKRAI}`,
	);

	const dragapultDeck: PrebuildDeck = importPrebuildDeckFromJson(
		`${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.DRAGAPULT_EX_DECK}`,
	);

	const marnieDeck: PrebuildDeck = importPrebuildDeckFromJson(
		`${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.MARNIE_RIVAL_DECK}`,
	);

	const gengarDeck: PrebuildDeck = importPrebuildDeckFromJson(
		`${CONFIG.DEFAULT_OUTPUT_DIRECTORY}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.MEGA_GENGAR_EX_DECK}`,
	);

	console.log('Convert dittodex to collection');
	const dittoDexCollectionCards: CollectionCard[] =
		await convetDittoDexCardsToCollectionCards({ dittoDexCards, tcgDex });

	console.log('Convert prebuild decks to collections');
	const armarougeCollectionDeck: CollectionCardDeck =
		await convertPrebuildToCollectionCards({
			prebuildDeck: armarougeDeck,
			tcgDex,
		});

	const pikachuCollectionDeck: CollectionCardDeck =
		await convertPrebuildToCollectionCards({
			prebuildDeck: pikachuDeck,
			tcgDex,
		});

	const darkraiCollectionDeck: CollectionCardDeck =
		await convertPrebuildToCollectionCards({
			prebuildDeck: darkraiDeck,
			tcgDex,
		});

	const dragapultCollectionDeck: CollectionCardDeck =
		await convertPrebuildToCollectionCards({
			prebuildDeck: dragapultDeck,
			tcgDex,
		});

	const marnieCollectionDeck: CollectionCardDeck =
		await convertPrebuildToCollectionCards({
			prebuildDeck: marnieDeck,
			tcgDex,
		});

	const gengarCollectionDeck: CollectionCardDeck =
		await convertPrebuildToCollectionCards({
			prebuildDeck: gengarDeck,
			tcgDex,
		});

	const collectionCards: CollectionCard[] = [
		...dittoDexCollectionCards,
		...armarougeCollectionDeck.cards,
		...pikachuCollectionDeck.cards,
		...darkraiCollectionDeck.cards,
		...dragapultCollectionDeck.cards,
		...marnieCollectionDeck.cards,
		...gengarCollectionDeck.cards,
	];

	console.log('Clear database');
	await deleteAllCollectionCard(db);

	console.log('Add collection cards to database');
	await Promise.all(
		collectionCards.map(async (collectionCard) => {
			return await addCollectionCard({ db, collectionCard });
		}),
	);

	console.log('Close database connection');
	await closeDatabaseConnection(db.client);
}

await resetCollectionCardsDatabase();
