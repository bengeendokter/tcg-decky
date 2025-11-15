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

export interface CollectionCardDeck {
	cards: CollectionCard[];
	name: string;
}
