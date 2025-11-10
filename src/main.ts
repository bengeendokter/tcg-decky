import { JSDOM } from 'jsdom';

async function main(): Promise<void> {
    const url: string = 'https://bulbapedia.bulbagarden.net/wiki/Mega_Gengar_ex_Mega_Battle_Deck_(TCG)';
    const pageText: string = await fetch(url).then(res => res.text());
    const dom: JSDOM = new JSDOM(pageText);

    const table: Element | null = dom.window.document.querySelector('h2:has(#Deck_list) + table');

    if (!table) {
        console.log('Deck list table not found');
        return;
    }

    console.log(table.outerHTML);
}

await main();