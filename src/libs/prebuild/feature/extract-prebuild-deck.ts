import { JSDOM } from 'jsdom';
import { type PrebuildDeck } from '../model/prebuild-deck';
import { covertTableToDeck } from './convert-table-to-deck';
import { parseUrlDeckName } from './parse-url-deck-name';
import { getPage } from '../data-access/get-page';

export async function extractPrebuildDecks(
	url: string,
): Promise<PrebuildDeck[]> {
	const pageText: string = await getPage(url);
	const dom: JSDOM = new JSDOM(pageText);

	const table: Element | null = dom.window.document.querySelector(
		'h2:has(#Deck_list) + table',
	);
	const tables: NodeListOf<Element> = dom.window.document.querySelectorAll(
		'h2:has(#Deck_lists) + table td table:has(th:nth-of-type(5))',
	);

	const urlName: string = parseUrlDeckName(url);

	if (table) {
		return [covertTableToDeck({ table, name: urlName })];
	}

	if (tables.length === 0) {
		throw Error('Deck list table not found');
	}

	const decks: PrebuildDeck[] = Array.from(tables.values()).map((table) => {
		const tableTitle: HTMLElement | null = table.querySelector('b');

		if (!tableTitle) {
			throw Error('Deck name not found in table');
		}

		const deckName: string = tableTitle.textContent
			.trim()
			.toLocaleLowerCase()
			.replaceAll(' ', '_');

		return covertTableToDeck({ table, name: `${urlName}_${deckName}` });
	});

	return decks;
}
