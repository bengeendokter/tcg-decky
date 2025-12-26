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

export const ENERGY_TYPE_PREBUILD_CARD_MAP = {
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

export const ENERGY_LOCAL_IDS = Object.values(ENERGY_TYPE_PREBUILD_CARD_MAP).map((energyPrebuildCard) => {
	return energyPrebuildCard.localId
}) satisfies number[];

export const ENERGY_IDS = ENERGY_LOCAL_IDS.map((localeId) => {
	return `sm1-${localeId}`;
}) satisfies string[];

export const ENERGY_TYPE_LOCAL_ID_CODE = {
	GRASS: 'G',
	FIRE: 'R',
	WATER: 'W',
	LIGHTNING: 'L',
	PSYCHIC: 'P',
	FIGHTING: 'F',
	DARKNESS: 'D',
	METAL: 'M',
} as const satisfies Record<keyof typeof ENERGY_TYPES, Uppercase<string>>;

type EnergyTypeLocalIdCode =
	(typeof ENERGY_TYPE_LOCAL_ID_CODE)[keyof typeof ENERGY_TYPE_LOCAL_ID_CODE];

export function isEnergyTypeLocalIdCode(
	localId: string,
): localId is EnergyTypeLocalIdCode {
	const localIdCodes: string[] = Object.values(ENERGY_TYPE_LOCAL_ID_CODE);
	return localIdCodes.includes(localId);
}

export const ENERGY_TYPE_LOCAL_ID_CODE_MAP = {
	[ENERGY_TYPES.GRASS]: ENERGY_TYPE_LOCAL_ID_CODE.GRASS,
	[ENERGY_TYPES.FIRE]: ENERGY_TYPE_LOCAL_ID_CODE.FIRE,
	[ENERGY_TYPES.WATER]: ENERGY_TYPE_LOCAL_ID_CODE.WATER,
	[ENERGY_TYPES.LIGHTNING]: ENERGY_TYPE_LOCAL_ID_CODE.LIGHTNING,
	[ENERGY_TYPES.PSYCHIC]: ENERGY_TYPE_LOCAL_ID_CODE.PSYCHIC,
	[ENERGY_TYPES.FIGHTING]: ENERGY_TYPE_LOCAL_ID_CODE.FIGHTING,
	[ENERGY_TYPES.DARKNESS]: ENERGY_TYPE_LOCAL_ID_CODE.DARKNESS,
	[ENERGY_TYPES.METAL]: ENERGY_TYPE_LOCAL_ID_CODE.METAL,
} as const satisfies Record<EnergyType, EnergyTypeLocalIdCode>;

export const LOCAL_ID_CODE_ENERGY_TYPE_MAP = {
	[ENERGY_TYPE_LOCAL_ID_CODE.GRASS]: ENERGY_TYPES.GRASS,
	[ENERGY_TYPE_LOCAL_ID_CODE.FIRE]: ENERGY_TYPES.FIRE,
	[ENERGY_TYPE_LOCAL_ID_CODE.WATER]: ENERGY_TYPES.WATER,
	[ENERGY_TYPE_LOCAL_ID_CODE.LIGHTNING]: ENERGY_TYPES.LIGHTNING,
	[ENERGY_TYPE_LOCAL_ID_CODE.PSYCHIC]: ENERGY_TYPES.PSYCHIC,
	[ENERGY_TYPE_LOCAL_ID_CODE.FIGHTING]: ENERGY_TYPES.FIGHTING,
	[ENERGY_TYPE_LOCAL_ID_CODE.DARKNESS]: ENERGY_TYPES.DARKNESS,
	[ENERGY_TYPE_LOCAL_ID_CODE.METAL]: ENERGY_TYPES.METAL,
} as const satisfies Record<EnergyTypeLocalIdCode, EnergyType>;
