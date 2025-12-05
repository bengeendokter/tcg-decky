import type { PrebuildSetCard } from './prebuild-deck';

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

export function isEnergyType(text: string): text is EnergyType {
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

export type EnergyTypeLocalId = (typeof ENERGY_TYPES_LOCAL_ID_MAP)[EnergyType];

export const energyTypeLocalIdMap: Map<EnergyType, EnergyTypeLocalId> = new Map(
	Object.entries(ENERGY_TYPES_LOCAL_ID_MAP).filter(
		(entry): entry is [EnergyType, EnergyTypeLocalId] => isEnergyType(entry[0]),
	),
);

export const ENERGY_TYPES_PREBUILD_CARD_MAP = {
	[ENERGY_TYPES.GRASS]: {
		name: `Basic ${ENERGY_TYPES.GRASS} Energy`,
		localId: 164,
		setName: 'Sun & Moon',
	},
	[ENERGY_TYPES.FIRE]: {
		name: `Basic ${ENERGY_TYPES.FIRE} Energy`,
		localId: 165,
		setName: 'Sun & Moon',
	},
	[ENERGY_TYPES.WATER]: {
		name: `Basic ${ENERGY_TYPES.WATER} Energy`,
		localId: 166,
		setName: 'Sun & Moon',
	},
	[ENERGY_TYPES.LIGHTNING]: {
		name: `Basic ${ENERGY_TYPES.LIGHTNING} Energy`,
		localId: 167,
		setName: 'Sun & Moon',
	},
	[ENERGY_TYPES.PSYCHIC]: {
		name: `Basic ${ENERGY_TYPES.PSYCHIC} Energy`,
		localId: 168,
		setName: 'Sun & Moon',
	},
	[ENERGY_TYPES.FIGHTING]: {
		name: `Basic ${ENERGY_TYPES.FIGHTING} Energy`,
		localId: 169,
		setName: 'Sun & Moon',
	},
	[ENERGY_TYPES.DARKNESS]: {
		name: `Basic ${ENERGY_TYPES.DARKNESS} Energy`,
		localId: 170,
		setName: 'Sun & Moon',
	},
	[ENERGY_TYPES.METAL]: {
		name: `Basic ${ENERGY_TYPES.METAL} Energy`,
		localId: 171,
		setName: 'Sun & Moon',
	},
} as const satisfies Record<EnergyType, PrebuildSetCard>;
