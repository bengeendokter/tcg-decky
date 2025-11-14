export interface LimitlessCard {
	quantity: number;
	name: string;
	tcgOnline: string;
	localId: number;
}

export const CATEGORY = {
	POKEMON: 'Pokemon',
	TRAINER: 'Trainer',
	ENERGY: 'Energy',
} as const satisfies Record<Uppercase<string>, string>;

export type Category = (typeof CATEGORY)[keyof typeof CATEGORY];

export function isCategory(text: string): text is Category {
	const categories: string[] = Object.values(CATEGORY);
	return categories.includes(text);
}

export interface LimitlessCardWithCategory extends LimitlessCard {
	category: Category;
}

export interface LimitlessDeck {
	name: string;
	pokemon: LimitlessCard[];
	trainer: LimitlessCard[];
	energy: LimitlessCard[];
}
