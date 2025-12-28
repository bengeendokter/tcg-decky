export const POKEMON_TYPE = {
	GRASS: 'Grass',
	FIRE: 'Fire',
	WATER: 'Water',
	LIGHTNING: 'Lightning',
	FIGHTING: 'Fighting',
	PSYCHIC: 'Psychic',
	COLORLESS: 'Colorless',
	DARKNESS: 'Darkness',
	METAL: 'Metal',
	DRAGON: 'Dragon',
} as const satisfies Record<Uppercase<string>, string>;

export type PokemonType = (typeof POKEMON_TYPE)[keyof typeof POKEMON_TYPE];

export const POKEMON_TYPES = [
	POKEMON_TYPE.GRASS,
	POKEMON_TYPE.FIRE,
	POKEMON_TYPE.WATER,
	POKEMON_TYPE.LIGHTNING,
	POKEMON_TYPE.FIGHTING,
	POKEMON_TYPE.PSYCHIC,
	POKEMON_TYPE.COLORLESS,
	POKEMON_TYPE.DARKNESS,
	POKEMON_TYPE.METAL,
	POKEMON_TYPE.DRAGON,
] as const satisfies PokemonType[];

export const ALL = 'All' as const satisfies string;

export type All = typeof ALL;
