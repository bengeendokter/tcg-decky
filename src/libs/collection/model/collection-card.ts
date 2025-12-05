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

export const collectionCardValidatorAndStripper: Type<CollectionCard> = type({
	'+': 'delete',
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

export const collectionCardDeckValidatorAndStripper: Type<CollectionCardDeck> =
	type({
		'+': 'delete',
		cards: collectionCardValidatorAndStripper.array(),
		name: 'string',
	});
