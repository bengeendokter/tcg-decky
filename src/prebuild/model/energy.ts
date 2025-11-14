export const ENERGY_TYPES = {
	GRASS: 'Grass',
	FIRE: 'Fire',
	WATER: 'Water',
	LIGHTNING: 'Lightning',
	PSYCHIC: 'Psychic',
	DARKNESS: 'Darkness',
	METAL: 'Metal',
	FAIRY: 'Fairy',
} as const satisfies Record<Uppercase<string>, string>;

export type EnergyType = (typeof ENERGY_TYPES)[keyof typeof ENERGY_TYPES];
export type EnergyCard = `Basic ${EnergyType} Energy`;

export function isEnergyCard(text: string): text is EnergyCard {
	const energyCards: string[] = Object.values(ENERGY_TYPES).map(
		(energyType): EnergyCard => `Basic ${energyType} Energy`,
	);
	return energyCards.includes(text);
}
