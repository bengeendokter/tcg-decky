import { extractPrebuildDecks } from '../../libs/prebuild/feature/extract-prebuild-deck';
import type { PrebuildDeck } from '../../libs/prebuild/model/prebuild-deck';
import { exportPrebuildDecksToJson } from '../../libs/prebuild/data-access/export-prebuild-decks-to-json';
import { convertPrebuildToLimitlessDeck } from '../../libs/limitless/feature/convert-prebuild-to-limitless-deck';
import type { LimitlessDeck } from '../../libs/limitless/model/limitless-deck';
import { exportLimitlessDeckToTxt } from '../../libs/limitless/data-access/export-limitless-deck-to-txt';
import { importPrebuildDeckFromJson } from '../../libs/prebuild/data-access/import-prebuild-deck-from-json';
import { connectToDatabase } from '../../libs/collection/data-access/connect-to-database';
import type { Db, FindCursor, UpdateResult, WithId } from 'mongodb';
import { closeDatabaseConnection } from '../../libs/collection/data-access/close-database-connection';
import type {
	CollectionCard,
	CollectionCardDeck,
} from '../../libs/collection/model/collection-card';
import { addCollectionCard } from '../../libs/collection/data-access/add-collection-card';
import { removeCollectionCard } from '../../libs/collection/data-access/remove-collection-card';
import { getAllCollectionCards } from '../../libs/collection/data-access/get-all-collection-cards';
import { convertPrebuildToCollectionCards } from '../../libs/collection/feature/convert-prebuild-to-collection-cards';
import { exportCollectionCardDeckToJson } from '../../libs/collection/data-access/export-collection-card-deck-to-json';
import { importCollectionCardDeckFromJson } from '../../libs/collection/data-access/import-collection-card-deck-from-json';
import { importDittoDexCardsFromCsv } from '../../libs/ditto-dex/data-access/import-ditto-dex-cards-from-csv';
import type { DittoDexCard } from '../../libs/ditto-dex/model/ditto-dex-card';
import { convetDittoDexCardsToCollectionCards } from '../../libs/collection/feature/convert-ditto-dex-cards-to-collection-cards';
import { addCollectionCardDeck } from '../../libs/collection/data-access/add-collection-card-deck';
import { updateCollectionCardDeck } from '../../libs/collection/data-access/update-collection-card-deck';
import { getAllCollectionCardDecks } from '../../libs/collection/data-access/get-all-collection-card-decks';
import { convertCollectionToLimitlessDeck } from '../../libs/limitless/feature/convert-collection-to-limitless-deck';
import TCGdex from '@tcgdex/sdk';
import { getTcgDex } from '../../libs/tcg-dex/data-access/get-tcg-dex';
import { CONFIG } from '../../config';

const deckUrl: string = CONFIG.PREBUILD_DECKS_URL.MARNIE_RIVAL_DECK;
const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;
const prebuildDeckJsonFilePath: string = `${outputDirectory}/${CONFIG.PREBUILD_DECK_JSON_FILE_NAME.MARNIE_RIVAL_DECK}`;
const collectionCardDeckJsonFilePath: string = `${outputDirectory}/${CONFIG.COLLECTION_CARD_DECK_JSON_FILE_NAME.MARNIE_RIVAL_DECK}`;
const databaseUrl: string = CONFIG.MONGO_DB_DATABASE_URL;

const tcgDex: TCGdex = getTcgDex(CONFIG.TCG_DEX_SERVER_URL);

// Extract prebuild decks from webpage
// const decks: PrebuildDeck[] = await extractPrebuildDecks(deckUrl);

// Export prebuild decks to JSON
// exportPrebuildDecksToJson({ decks, outputDirectory });

// Convert prebuild decks to Limitless decks and export to TXT
// decks.forEach(async (deck) => {
// 	const limitlessDeck: LimitlessDeck =
// 		await convertPrebuildToLimitlessDeck(deck);
// 	exportLimitlessDeckToTxt({ limitlessDeck, outputDirectory });
// });

// Import prebuild decks from JSON
// const prebuildDeck: PrebuildDeck = importPrebuildDeckFromJson(prebuildDeckJsonFilePath);

// Convert prebuild deck to Limitless deck
// const limitlessDeck: LimitlessDeck =
// 	await convertPrebuildToLimitlessDeck(prebuildDeck);

// Export limitless deck to TXT
// exportLimitlessDeckToTxt({ limitlessDeck, outputDirectory });

// Connect to database
const db: Db = await connectToDatabase(databaseUrl);

const collectionCard: CollectionCard = {
	_id: 'swsh3-137',
	variants: {
		firstEdition: 4,
		holo: 4,
	},
};

await removeCollectionCard({ db, collectionCard });

// Get all collection cards
// const collectionCards: CollectionCard[] = await getAllCollectionCards(db);

// Convert prebuild deck to collection card deck
// const deck: CollectionCardDeck =
// 	await convertPrebuildToCollectionCards(prebuildDeck);

// Export collection card deck to JSON
// exportCollectionCardDeckToJson({deck, outputDirectory});

// Import collection card deck from JSON
// const collectionCardDeck: CollectionCardDeck = importCollectionCardDeckFromJson(
// 	collectionCardDeckJsonFilePath,
// );

// const dittoDexCards: DittoDexCard[] = importDittoDexCardsFromCsv(csvFilePath);

// const collectionCards: CollectionCard[] =
// 	await convetDittoDexCardsToCollectionCards({dittoDexCards, tcgdex});

// const collectionCardDeck: CollectionCardDeck = {
// 	name: 'Deck 9',
// 	cards: collectionCards,
// };

// const collectionCardDeckUpdateResult: UpdateResult<CollectionCardDeck> =
// 	await updateCollectionCardDeck({
// 		collectionCardDeck,
// 		db,
// 		id: '691b670ffbbea7eccc5b67e0',
// 	});

// const collectionCardDecks: CollectionCardDeck[] =
// 	await getAllCollectionCardDecks(db);

// const collectionCardDeck: CollectionCardDeck | undefined =
// 	collectionCardDecks[0];

// if (collectionCardDeck === undefined) {
// 	throw Error('collectionCardDeck not found');
// }

// const limitlessDeck: LimitlessDeck = await convertCollectionToLimitlessDeck(collectionCardDeck);

// Close database connection
await closeDatabaseConnection(db.client);
