import { JSDOM } from 'jsdom';

interface SetCard {
    name: string;
    localId: number;
    setName: string;
}

const ENERGY_TYPES = {
    GRASS: 'Grass',
    FIRE: 'Fire',
    WATER: 'Water',
    LIGHTNING: 'Lightning',
    PSYCHIC: 'Psychic',
    DARKNESS: 'Darkness',
    METAL: 'Metal',
    FAIRY: 'Fairy',
} as const satisfies Record<Uppercase<string>, string>;

type EnergyType = typeof ENERGY_TYPES[keyof typeof ENERGY_TYPES];
type EnergyTitle = `Basic ${EnergyType} Energy (TCG)`;

function isEnergyTitle(text: string): text is EnergyTitle {
    return Object.values(ENERGY_TYPES)
        .map((energyType): EnergyTitle => `Basic ${energyType} Energy (TCG)`)
        .some(energyTitle => {
            return text === energyTitle;
        });
}

interface CardWithQuantity {
    card: SetCard | EnergyType;
    quantity: number;
}

type CardTitle = `${string} (${string} ${number})`;

function isCardTitle(text: string): text is CardTitle {
    return /.+ \(.+ \d+\)$/.test(text);
}

type QuantityText = `${number}×`;

async function main(): Promise<void> {
    const url: string = 'https://bulbapedia.bulbagarden.net/wiki/Mega_Gengar_ex_Mega_Battle_Deck_(TCG)';
    const pageText: string = await fetch(url).then(res => res.text());
    const dom: JSDOM = new JSDOM(pageText);

    const table: Element | null = dom.window.document.querySelector('h2:has(#Deck_list) + table');

    if (!table) {
        console.log('Deck list table not found');
        return;
    }

    const deck: CardWithQuantity[] = [];

    const rows: NodeListOf<Element> = table.querySelectorAll('tr:has(td:nth-of-type(3))');

    rows.forEach(row => {
        const cardTableData: Element | null = row.querySelector('td:nth-of-type(3) a');
        const quantityTableData: Element | null = row.querySelector('td:nth-of-type(4)');

        if (!cardTableData || !quantityTableData) {
            return;
        }

        const title: string | null = cardTableData.getAttribute('title');
        const quantityText: string = quantityTableData.textContent.trim();

        if (!title) {
            return;
        }

        console.log(isCardTitle(title) || isEnergyTitle(title));
        console.log(quantityText);
    });
}

await main();