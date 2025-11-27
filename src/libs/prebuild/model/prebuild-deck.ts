import { isEnergyCard, type EnergyCard } from './energy.ts';

export interface PrebuildSetCard {
	name: string;
	localId: number;
	setName: string;
}

export function isPrebuildSetCard(object: object): object is PrebuildSetCard {
	if (!('name' in object) || typeof object['name'] !== 'string') {
		return false;
	}

	if (!('localId' in object) || typeof object['localId'] !== 'number') {
		return false;
	}

	if (!('setName' in object) || typeof object['setName'] !== 'string') {
		return false;
	}

	return true;
}

export type PrebuildCard = PrebuildSetCard | EnergyCard;

export function isPrebuildCard(card: object | string): card is PrebuildCard {
	if (typeof card === 'string') {
		return isEnergyCard(card);
	}

	return isPrebuildSetCard(card);
}

export interface PrebuildCardWithQuantity {
	card: PrebuildCard;
	quantity: number;
}

export function isPrebuildCardWithQuantity(
	object: object,
): object is PrebuildCardWithQuantity {
	if (!('card' in object)) {
		return false;
	}

	if (!('quantity' in object) || typeof object['quantity'] !== 'number') {
		return false;
	}

	const card: unknown = object['card'];

	if ((typeof card !== 'object' && typeof card !== 'string') || card === null) {
		return false;
	}

	return isPrebuildCard(card);
}

export interface PrebuildDeck {
	cards: PrebuildCardWithQuantity[];
	name: string;
}

export function isPrebuildDeck(object: object): object is PrebuildDeck {
	if (!('name' in object) || typeof object['name'] !== 'string') {
		return false;
	}

	if (!('cards' in object) || !Array.isArray(object['cards'])) {
		return false;
	}

	return object.cards.every((card: unknown) => {
		if (typeof card !== 'object' || card === null) {
			return false;
		}

		return isPrebuildCardWithQuantity(card);
	});
}

export interface PrebuildSetCardWithQuantity {
	card: PrebuildSetCard;
	quantity: number;
}

export interface PrebuildEnergyCardWithQuantity {
	card: EnergyCard;
	quantity: number;
}
