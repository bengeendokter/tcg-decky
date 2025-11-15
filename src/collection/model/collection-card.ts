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
