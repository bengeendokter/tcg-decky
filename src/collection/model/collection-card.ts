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

export function isCollectionCard(object: object): object is CollectionCard {
	if (!('_id' in object) || typeof object['_id'] !== 'string') {
		return false;
	}

	if (!('variants' in object) || typeof object['variants'] !== 'object' || object['variants'] === null) {
		return false;
	}

	const variants: object = object['variants'];

	if('firstEdition' in variants && typeof variants['firstEdition'] !== 'number') {
		return false;
	}

	if('holo' in variants && typeof variants['holo'] !== 'number') {
		return false;
	}

	if('normal' in variants && typeof variants['normal'] !== 'number') {
		return false;
	}

	if('reverse' in variants && typeof variants['reverse'] !== 'number') {
		return false;
	}

	if('wPromo' in variants && typeof variants['wPromo'] !== 'number') {
		return false;
	}

	return true;
}

export interface CollectionCardDeck {
	cards: CollectionCard[];
	name: string;
}

export function isCollectionCardDeck(
	object: object,
): object is CollectionCardDeck {
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

		return isCollectionCard(card);
	});
}
