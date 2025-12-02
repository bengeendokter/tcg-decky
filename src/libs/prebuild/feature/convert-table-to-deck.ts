import {
	type PrebuildDeck,
	type PrebuildCardWithQuantity,
	type PrebuildCard,
} from '../model/prebuild-deck';
import { parsePrebuildCard } from './parse-prebuild-card';
import { isQuantityText } from '../model/quantity';
import { isTitle } from '../model/title';

export interface CovertTableToDeckParams {
	table: Element;
	name: string;
}

export function covertTableToDeck({
	table,
	name,
}: CovertTableToDeckParams): PrebuildDeck {
	const cards: PrebuildCardWithQuantity[] = [];

	const rows: NodeListOf<Element> = table.querySelectorAll(
		'tr:has(td:nth-of-type(3))',
	);

	rows.forEach((row) => {
		const cardTableData: Element | null = row.querySelector(
			'td:nth-of-type(3) > a',
		);
		const quantityTableData: Element | null =
			row.querySelector('td:nth-of-type(4)');

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
		const card: PrebuildCard = parsePrebuildCard(title);

		return cards.push({ card, quantity });
	});

	return { name, cards };
}
