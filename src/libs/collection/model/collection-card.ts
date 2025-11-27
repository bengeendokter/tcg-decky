import { Type, type } from 'arktype';

export interface CollectionCard {
	_id: string;
	variants: {
		firstEdition?: number;
		holo?: number;
		normal?: number;
		reverse?: number;
		wPromo?: number;
	};
}

export const collectionCardValidator: Type<CollectionCard> = type({
	_id: 'string',
	variants: {
		'firstEdition?': 'number',
		'holo?': 'number',
		'normal?': 'number',
		'reverse?': 'number',
		'wPromo?': 'number',
	},
});

export interface CollectionCardDeck {
	cards: CollectionCard[];
	name: string;
}

export const collectionCardDeckValidator: Type<CollectionCardDeck> = type({
	cards: collectionCardValidator.array(),
	name: 'string',
});
