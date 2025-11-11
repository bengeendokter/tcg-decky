import * as fs from 'fs';
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
type EnergyCard = `Basic ${EnergyType} Energy`;
type EnergyTitle = `${EnergyCard} (TCG)`;

function isEnergyTitle(text: string): text is EnergyTitle {
    return Object.values(ENERGY_TYPES)
        .map((energyType): EnergyTitle => `Basic ${energyType} Energy (TCG)`)
        .some(energyTitle => {
            return text === energyTitle;
        });
}

function parseEnergyType(text: string): EnergyType | undefined {
    const energyTypes: EnergyType[] = Object.values(ENERGY_TYPES);
    for (const energyType of energyTypes) {
        if (text.includes(energyType)) {
            return energyType;
        }
    }

    return undefined;
}

type Card = SetCard | EnergyCard;

interface CardWithQuantity {
    card: Card;
    quantity: number;
}

type CardTitle = `${string} (${string} ${number})`;

function isCardTitle(text: string): text is CardTitle {
    return /.+ \(.+ \d+\)$/.test(text);
}

function parseSetCard(title: CardTitle): SetCard {
    const [name, setAndId]: string[] = title.replace(')', '').split(' (');

    if (!name || !setAndId) {
        throw Error(`Unable to parse set card from title: ${title}`);
    }

    const setName: string = setAndId.split(' ').slice(0, -1).join(' ');
    const localIdText: string | undefined = setAndId.split(' ').at(-1);

    if (!localIdText || setName === ' ') {
        throw Error(`Unable to parse set card from title: ${title}`);
    }

    const localId: number = parseInt(localIdText);

    return {
        name,
        setName,
        localId,
    };
}

type Title = CardTitle | EnergyTitle;

function isTitle(text: string): text is Title {
    return isCardTitle(text) || isEnergyTitle(text);
}

type QuantityText = `${number}×`;

function isQuantityText(text: string): text is QuantityText {
    return /^\d+×$/.test(text);
}

interface Deck {
    cards: CardWithQuantity[];
    name: string;
}

function parseCard(title: Title): Card {
    if (isEnergyTitle(title)) {
        const energyType: EnergyType | undefined = parseEnergyType(title);

        if (!energyType) {
            throw Error(`Unable to parse energy type from title: ${title}`);
        }

        return `Basic ${energyType} Energy`;
    }

    return parseSetCard(title);
}

export function parseUrlDeckName(url: string): string {
    if (!URL.canParse(url)) {
        throw Error(`${url} is not a valid URL`);
    }

    const parsableUrl: URL = new URL(url);
    const pathName: string | undefined = parsableUrl.pathname.split('/').at(-1);

    if (!pathName) {
        throw Error(`Unable to parse deck name from URL: ${url}`);
    }

    return pathName.replaceAll('_(TCG)', '').toLocaleLowerCase();
}


async function main(url: string): Promise<Deck> {
    const pageText: string = await fetch(url).then(result => result.text());
    const dom: JSDOM = new JSDOM(pageText);

    const table: Element | null = dom.window.document.querySelector('h2:has(#Deck_list) + table');

    if (!table) {
        throw Error('Deck list table not found');
    }

    const cards: CardWithQuantity[] = [];
    const name: string = parseUrlDeckName(url);

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

        if (!isTitle(title)) {
            return;
        }

        if (!isQuantityText(quantityText)) {
            return;
        }

        const quantity: number = parseInt(quantityText.replace('×', ''));
        const card: Card = parseCard(title);

        return cards.push({ card, quantity });
    });

    return { name, cards }
}

const CONFIG = {
    DEFAULT_OUTPUT_DIRECTORY: "./output",
    MEGA_GENGAR_EX_DECK_URL: 'https://bulbapedia.bulbagarden.net/wiki/Mega_Gengar_ex_Mega_Battle_Deck_(TCG)',
    DRAGAPULT_EX_DECK_URL: 'https://bulbapedia.bulbagarden.net/wiki/Dragapult_ex_League_Battle_Deck_(TCG)',
    MARNIE_RIVAL_DECK_URL: 'https://bulbapedia.bulbagarden.net/wiki/Marnie_Rival_Battle_Deck_(TCG)',
    BATTLE_ACADEMY_2024_DECKS_URL: 'https://bulbapedia.bulbagarden.net/wiki/Battle_Academy_2024_(TCG)'
} as const satisfies Record<Uppercase<string>, string>;

const url: string = CONFIG.MARNIE_RIVAL_DECK_URL;
const deck: Deck = await main(url);
const outputDirectory: string = CONFIG.DEFAULT_OUTPUT_DIRECTORY;
const deckFileName = `${outputDirectory}/${deck.name}.json`;
fs.writeFileSync(deckFileName, JSON.stringify(deck, null, 2), { encoding: 'utf-8' });