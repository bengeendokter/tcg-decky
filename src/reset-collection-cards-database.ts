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

	const dittoDexCollectionCards: CollectionCard[] =
		await convetDittoDexCardsToCollectionCards({ dittoDexCards, tcgDex });

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

	await deleteAllCollectionCard(db);

	await Promise.all(
		collectionCards.map(async (collectionCard) => {
			return await addCollectionCard({ db, collectionCard });
		}),
	);

	await closeDatabaseConnection(db.client);
}
