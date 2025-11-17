import { extractPrebuildDecks } from './prebuild/feature/extract-prebuild-deck.ts';
import type { PrebuildDeck } from './prebuild/model/prebuild-deck.ts';
import { exportPrebuildDecksToJson } from './prebuild/data-access/export-prebuild-decks-to-json.ts';
import { convertPrebuildToLimitlessDeck } from './limitless/feature/convert-prebuild-to-limitless-deck.ts';
import type { LimitlessDeck } from './limitless/model/limitless-deck.ts';
import { exportLimitlessDeckToTxt } from './limitless/data-access/export-limitless-deck-to-txt.ts';
import { importPrebuildDeckFromJson } from './prebuild/data-access/import-prebuild-deck-from-json.ts';
import { connectToDatabase } from './collection/data-access/connect-to-database.ts';
import type { Db, FindCursor, UpdateResult, WithId } from 'mongodb';
import { closeDatabaseConnection } from './collection/data-access/close-database-connection.ts';
import type {
	CollectionCard,
	CollectionCardDeck,
} from './collection/model/collection-card.ts';
import { addCollectionCard } from './collection/data-access/add-collection-card.ts';
import { removeCollectionCard } from './collection/data-access/remove-collection-card.ts';
import { getAllCollectionCards } from './collection/data-access/get-all-collection-cards.ts';
import { convertPrebuildToCollectionCards } from './collection/feature/convert-prebuild-to-collection-cards.ts';
import { exportCollectionCardDeckToJson } from './collection/data-access/export-collection-card-deck-to-json.ts';
import { importCollectionCardDeckFromJson } from './collection/data-access/import-collection-card-deck-from-json.ts';
import { importDittoDexCardsFromCsv } from './ditto-dex/data-access/import-ditto-dex-cards-from-csv.ts';
import type { DittoDexCard } from './ditto-dex/model/ditto-dex-card.ts';
import { convetDittoDexCardsToCollectionCards } from './collection/feature/convert-ditto-dex-cards-to-collection-cards.ts';
import { addCollectionCardDeck } from './collection/data-access/add-collection-card-deck.ts';
import { updateCollectionCardDeck } from './collection/data-access/update-collection-card-deck.ts';
import { getAllCollectionCardDecks } from './collection/data-access/get-all-collection-card-decks.ts';

const PREBUILD_DECKS_URL = {
	MEGA_GENGAR_EX_DECK:
		'https://bulbapedia.bulbagarden.net/wiki/Mega_Gengar_ex_Mega_Battle_Deck_(TCG)',
	DRAGAPULT_EX_DECK:
		'https://bulbapedia.bulbagarden.net/wiki/Dragapult_ex_League_Battle_Deck_(TCG)',
	MARNIE_RIVAL_DECK:
		'https://bulbapedia.bulbagarden.net/wiki/Marnie_Rival_Battle_Deck_(TCG)',
	BATTLE_ACADEMY_2024_DECKS:
		'https://bulbapedia.bulbagarden.net/wiki/Battle_Academy_2024_(TCG)',
} as const satisfies Record<Uppercase<string>, string>;

const PREBUILD_DECK_JSON_FILE_NAME = {
	MEGA_GENGAR_EX_DECK: 'mega_gengar_ex_mega_battle_deck.json',
	DRAGAPULT_EX_DECK: 'dragapult_ex_league_battle_deck.json',
	MARNIE_RIVAL_DECK: 'marnie_rival_battle_deck.json',
	BATTLE_ACADEMY_2024_ARMAROUGE: 'battle_academy_2024_armarouge_deck.json',
	BATTLE_ACADEMY_2024_DARKRAI: 'battle_academy_2024_darkrai_deck.json',
	BATTLE_ACADEMY_2024_PIKACHU: 'battle_academy_2024_pikachu_deck.json',
} as const satisfies Record<Uppercase<string>, string>;

const COLLECTION_CARD_DECK_JSON_FILE_NAME = {
	MARNIE_RIVAL_DECK: 'marnie_rival_battle_deck_collection.json',
} as const satisfies Record<Uppercase<string>, string>;

const DEFAULT_OUTPUT_DIRECTORY = './output';

const CONFIG = {
	DEFAULT_OUTPUT_DIRECTORY,
	PREBUILD_DECKS_URL,
} as const satisfies Record<Uppercase<string>, string | object>;

const deckUrl: string = CONFIG.PREBUILD_DECKS_URL.MARNIE_RIVAL_DECK;
const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;
const prebuildDeckJsonFilePath: string = `${outputDirectory}/${PREBUILD_DECK_JSON_FILE_NAME.MARNIE_RIVAL_DECK}`;
const collectionCardDeckJsonFilePath: string = `${outputDirectory}/${COLLECTION_CARD_DECK_JSON_FILE_NAME.MARNIE_RIVAL_DECK}`;
const csvFilePath: string = 'data/dittodex_collection.csv';
const databaseUrl: string = 'mongodb://localhost:27017';

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

// const collectionCard: CollectionCard = {
// 	_id: 'swsh3-137',
// 	variants: {
// 		normal: 2,
// 		reverse: 9,
// 	},
// };

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

const dittoDexCards: DittoDexCard[] = importDittoDexCardsFromCsv(csvFilePath);

const collectionCards: CollectionCard[] =
	await convetDittoDexCardsToCollectionCards(dittoDexCards);

const collectionCardDeck: CollectionCardDeck = {
	name: 'Deck 9',
	cards: collectionCards,
};

const collectionCardDeckUpdateResult: UpdateResult<CollectionCardDeck> =
	await updateCollectionCardDeck({
		collectionCardDeck,
		db,
		id: '691b670ffbbea7eccc5b67e0',
	});

// Close database connection
await closeDatabaseConnection(db.client);
