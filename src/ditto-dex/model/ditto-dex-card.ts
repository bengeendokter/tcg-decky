export const VARIANT = {
	UNLIMITED: 'Unlimited',
	REVERSE_HOLO: 'Reverse Holo',
} as const satisfies Record<Uppercase<string>, string>;

export type Variant = (typeof VARIANT)[keyof typeof VARIANT];

export function isVariant(text: string): text is Variant {
	const variants: string[] = Object.values(VARIANT);
	return variants.includes(text);
}

export const CURRENCY = {
	EUR: 'EUR',
} as const satisfies Record<Uppercase<string>, string>;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

export function isCurrency(text: string): text is Currency {
	const currencies: string[] = Object.values(CURRENCY);
	return currencies.includes(text);
}

export interface DittoDexCard {
	id: string;
	name: string;
	pokedexNumber: number;
	number: number;
	setName: string;
	variant: Variant;
	qty: number;
	currency: Currency;
	value: number;
	totalValue: number;
}
