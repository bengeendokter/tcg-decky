export interface LimitlessCard {
	quantity: number;
	name: string;
	tcgOnline: string;
	localId: number;
}

export interface LimitlessDeck {
	name: string;
	pokemon: LimitlessCard[];
	trainer: LimitlessCard[];
	energy: LimitlessCard[];
}
