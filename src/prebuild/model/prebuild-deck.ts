import { type EnergyCard } from './energy.ts';

export interface PrebuildSetCard {
	name: string;
	localId: number;
	setName: string;
}

export type PrebuildCard = PrebuildSetCard | EnergyCard;

export interface PrebuildCardWithQuantity {
	card: PrebuildCard;
	quantity: number;
}

export interface PrebuildDeck {
	cards: PrebuildCardWithQuantity[];
	name: string;
}
