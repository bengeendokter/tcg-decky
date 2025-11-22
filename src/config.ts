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
const DITTO_DEX_SCV_FILE_PATH: string = 'data/dittodex_collection.csv';
const MONGO_DB_DATABASE_URL: string = 'mongodb://localhost:27017';
const TCG_DEX_SERVER_URL: string = 'http://localhost:3000/v2';

export const CONFIG = {
	DEFAULT_OUTPUT_DIRECTORY,
	PREBUILD_DECKS_URL,
	PREBUILD_DECK_JSON_FILE_NAME,
	COLLECTION_CARD_DECK_JSON_FILE_NAME,
	DITTO_DEX_SCV_FILE_PATH,
	MONGO_DB_DATABASE_URL,
	TCG_DEX_SERVER_URL,
} as const satisfies Record<Uppercase<string>, string | object>;
