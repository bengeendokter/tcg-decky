export const ENERGY_TYPES = {
	GRASS: 'Grass',
	FIRE: 'Fire',
	WATER: 'Water',
	LIGHTNING: 'Lightning',
	PSYCHIC: 'Psychic',
	FIGHTING: 'Fighting',
	DARKNESS: 'Darkness',
	METAL: 'Metal',
} as const satisfies Record<Uppercase<string>, string>;


export type EnergyType = (typeof ENERGY_TYPES)[keyof typeof ENERGY_TYPES];

export function isEnergyType(
	text: string,
): text is EnergyType {
	const energyTypes: string[] = Object.values(ENERGY_TYPES);
	return energyTypes.includes(text);
}

export const ENERGY_TYPES_LOCAL_ID_MAP = {
	[ENERGY_TYPES.GRASS]: 1,
	[ENERGY_TYPES.FIRE]: 2,
	[ENERGY_TYPES.WATER]: 3,
	[ENERGY_TYPES.LIGHTNING]: 4,
	[ENERGY_TYPES.PSYCHIC]: 5,
	[ENERGY_TYPES.FIGHTING]: 6,
	[ENERGY_TYPES.DARKNESS]: 7,
	[ENERGY_TYPES.METAL]: 8,
} as const satisfies Record<EnergyType, number>;

export type EnergyTypeLocalId = typeof ENERGY_TYPES_LOCAL_ID_MAP[EnergyType];

export const energyTypeLocalIdMap: Map<EnergyType, EnergyTypeLocalId> = new Map(
	Object.entries(ENERGY_TYPES_LOCAL_ID_MAP).filter((entry): entry is [EnergyType, EnergyTypeLocalId] => isEnergyType(entry[0])),
);
export type EnergyCard = `Basic ${EnergyType} Energy`;

export function isEnergyCard(text: string): text is EnergyCard {
	const energyCards: string[] = Object.values(ENERGY_TYPES).map(
		(energyType): EnergyCard => `Basic ${energyType} Energy`,
	);
	return energyCards.includes(text);
}
