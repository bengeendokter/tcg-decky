import { JSDOM } from 'jsdom';
import { type Deck } from './model/prebuild-deck.ts';
import { covertTableToDeck } from './feature/convert-table-to-deck.ts';
import { parseUrlDeckName } from './feature/parse-url-deck-name.ts';

export async function extractPrebuildDeck(url: string): Promise<Deck[]> {
    const pageText: string = await fetch(url).then(result => result.text());
    const dom: JSDOM = new JSDOM(pageText);

    const table: Element | null = dom.window.document.querySelector('h2:has(#Deck_list) + table');
    const tables: NodeListOf<Element> = dom.window.document.querySelectorAll('h2:has(#Deck_lists) + table td table:has(th:nth-of-type(5))');

    const urlName: string = parseUrlDeckName(url);

    if (table) {
        return [covertTableToDeck({ table, name: urlName })];
    }

    if (tables.length === 0) {
        throw Error('Deck list table not found');
    }

    const decks: Deck[] = Array.from(tables.values()).map((table) => {
        const tableTitle: HTMLElement | null = table.querySelector('b');

        if (!tableTitle) {
            throw Error('Deck name not found in table');
        }

        const deckName: string = tableTitle.textContent.trim().toLocaleLowerCase().replaceAll(' ', '_');

        return covertTableToDeck({ table, name: `${urlName}_${deckName}` });
    });

    return decks;
}