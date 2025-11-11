import { type EnergyCard } from "./energy.ts";

export interface SetCard {
    name: string;
    localId: number;
    setName: string;
}

export type Card = SetCard | EnergyCard;

export interface CardWithQuantity {
    card: Card;
    quantity: number;
}

export interface Deck {
    cards: CardWithQuantity[];
    name: string;
}