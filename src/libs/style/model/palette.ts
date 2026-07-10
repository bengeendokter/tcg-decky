import { fromEntries } from '@ark/util';
import { type, type Type } from 'arktype';
import Color from 'colorjs.io';
import type { UnionToTuple } from 'type-fest';

type BuildTuple<N extends number, Current extends number[] = []> = Current['length'] extends N
	? Current
	: BuildTuple<N, [...Current, Current['length']]>;

export const PALETTE_VALUES = Array.from({ length: 101 }, (_, i) => i) as BuildTuple<101>;

export type PaletteValue = (typeof PALETTE_VALUES)[number];

export const PALETTE_TYPE = {
	PRIMARY: 'primary',
	SECONDARY: 'secondary',
	TERTIARY: 'tertiary',
	NEUTRAL: 'neutral',
	NEUTRAL_VARIANT: 'neutral-variant',
	ERROR: 'error',
} as const satisfies Record<Uppercase<string>, string>;

export type PaletteType = (typeof PALETTE_TYPE)[keyof typeof PALETTE_TYPE];

export const PALETTE_TYPES = [
	PALETTE_TYPE.PRIMARY,
	PALETTE_TYPE.SECONDARY,
	PALETTE_TYPE.TERTIARY,
	PALETTE_TYPE.NEUTRAL,
	PALETTE_TYPE.NEUTRAL_VARIANT,
	PALETTE_TYPE.ERROR,
] as const satisfies UnionToTuple<PaletteType>;

export const paletteTypeValidator: Type<PaletteType> = type.enumerated(...PALETTE_TYPES);

function mapPaletteValueToLightness(paletteValue: number): number {
	if (paletteValue === 0) {
		return 0;
	}

	const calculatedResult: number = -0.000872 * paletteValue ** 2 + 0.9504 * paletteValue + 13.47;
	return Math.min(calculatedResult, 100) / 100;
}

export const CHROMA_FACTOR = {
	[PALETTE_TYPE.PRIMARY]: 1.2,
	[PALETTE_TYPE.SECONDARY]: 1.2,
	[PALETTE_TYPE.TERTIARY]: 1.2,
	[PALETTE_TYPE.NEUTRAL]: 0.5,
	[PALETTE_TYPE.NEUTRAL_VARIANT]: 0.5,
	[PALETTE_TYPE.ERROR]: 1,
} as const satisfies Record<PaletteType, number>;

export type ChromaFactor = (typeof CHROMA_FACTOR)[keyof typeof CHROMA_FACTOR];

export interface Oklch {
	l: number;
	c: number;
	h: number;
}

export const oklchValidator: Type<Oklch> = type({
	l: 'number',
	c: 'number',
	h: 'number',
});

export type Palette = Record<PaletteValue, Oklch>;

export type FullPaletteCollection = {
	[palleteType in PaletteType]: Palette;
};

export function getPaletteValueOklch(
	palleteValue: number,
	chromaFactor: ChromaFactor,
	baseColor: Oklch,
): Oklch {
	return {
		l: mapPaletteValueToLightness(palleteValue),
		c: (Math.sin(0.009 * palleteValue * Math.PI) * baseColor.c) / chromaFactor,
		h: baseColor.h,
	};
}

export function getSecondaryBaseColor(themeBaseColor: Oklch): Oklch {
	return {
		l: themeBaseColor.l,
		c: themeBaseColor.c / 3,
		h: themeBaseColor.h,
	};
}

export function getTertiaryBaseColor(themeBaseColor: Oklch): Oklch {
	return {
		l: themeBaseColor.l,
		c: themeBaseColor.c / 2,
		h: themeBaseColor.h + 60,
	};
}

export function getNeutralBaseColor(themeBaseColor: Oklch): Oklch {
	return {
		l: themeBaseColor.l,
		c: Math.min(themeBaseColor.c / 12, 0.01),
		h: themeBaseColor.h,
	};
}

export function getNeutralVariantBaseColor(themeBaseColor: Oklch): Oklch {
	return {
		l: themeBaseColor.l,
		c: Math.min(themeBaseColor.c / 6, 0.02),
		h: themeBaseColor.h,
	};
}

export function getErrorBaseColor(themeBaseColor: Oklch): Oklch {
	return {
		l: themeBaseColor.l,
		c: 0.2,
		h: 25,
	};
}

export function getPaletteBaseColor(themeBaseColor: Oklch, paletteType: PaletteType): Oklch {
	switch (paletteType) {
		case PALETTE_TYPE.PRIMARY:
			return themeBaseColor;
		case PALETTE_TYPE.SECONDARY:
			return getSecondaryBaseColor(themeBaseColor);
		case PALETTE_TYPE.TERTIARY:
			return getTertiaryBaseColor(themeBaseColor);
		case PALETTE_TYPE.NEUTRAL:
			return getNeutralBaseColor(themeBaseColor);
		case PALETTE_TYPE.NEUTRAL_VARIANT:
			return getNeutralVariantBaseColor(themeBaseColor);
		case PALETTE_TYPE.ERROR:
			return getErrorBaseColor(themeBaseColor);
		default:
			paletteType satisfies never;
			return themeBaseColor;
	}
}

export function getPalette(palleteType: PaletteType, themeBaseColor: Oklch): Palette {
	const paletteEntries: [PaletteValue, Oklch][] = PALETTE_VALUES.map(
		(paletteValue: PaletteValue) => [
			paletteValue,
			getPaletteValueOklch(
				paletteValue,
				CHROMA_FACTOR[palleteType],
				getPaletteBaseColor(themeBaseColor, palleteType),
			),
		],
	);

	return fromEntries(paletteEntries);
}

export function getFullPaletteCollection(themeBaseColor: Oklch): FullPaletteCollection {
	const fullPaletteCollectionEntries: [PaletteType, Palette][] = PALETTE_TYPES.map(
		(paletteType: PaletteType) => [paletteType, getPalette(paletteType, themeBaseColor)],
	);

	return fromEntries(fullPaletteCollectionEntries);
}

type PaletteValueToken = {
	$type: 'color';
	$value: {
		colorSpace: 'oklch';
		components: [number, number, number];
	};
};

type PaletteTokens = {
	[value in PaletteValue]: PaletteValueToken;
};

export type FullPaletteCollectionTokens = {
	[paletteType in PaletteType]: PaletteTokens;
};

function getValueTokens(oklch: Oklch): PaletteValueToken {
	return {
		$type: 'color',
		$value: {
			colorSpace: 'oklch',
			components: [oklch.l, oklch.c, oklch.h],
		},
	};
}

function getPaletteTokens(palette: Palette): PaletteTokens {
	const paletteTokensEntries: [PaletteValue, PaletteValueToken][] = PALETTE_VALUES.map(
		(paletteValue: PaletteValue) => [paletteValue, getValueTokens(palette[paletteValue])],
	);

	return fromEntries(paletteTokensEntries);
}

export function getFullPaletteCollectionTokens(
	fullPaletteCollection: FullPaletteCollection,
): FullPaletteCollectionTokens {
	const fullPaletteCollectionTokensEntries: [PaletteType, PaletteTokens][] = PALETTE_TYPES.map(
		(paletteType: PaletteType) => [
			paletteType,
			getPaletteTokens(fullPaletteCollection[paletteType]),
		],
	);

	return fromEntries(fullPaletteCollectionTokensEntries);
}

type PenpotPaletteValueToken = {
	$type: 'color';
	$value: `hsl(${number} ${number}% ${number}%)`;
};

type PenpotPaletteTokens = {
	[value in PaletteValue]: PenpotPaletteValueToken;
};

export type PenpotFullPaletteCollectionTokens = {
	[paletteType in PaletteType]: PenpotPaletteTokens;
};

export interface Hsl {
	h: number;
	s: number;
	l: number;
}

function oklchToHsl(oklch: Oklch): Hsl {
	const color: Color = new Color('oklch', [oklch.l, oklch.c, oklch.h]);
	const h: number = color.hsl[0] ?? 0;
	const s: number = color.hsl[1] ?? 0;
	const l: number = color.hsl[2] ?? 0;

	return { h, s, l };
}

function getPenpotValueTokens(hsl: Hsl): PenpotPaletteValueToken {
	return {
		$type: 'color',
		$value: `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`,
	};
}

function getPenpotPaletteTokens(palette: Palette): PenpotPaletteTokens {
	const paletteTokensEntries: [PaletteValue, PenpotPaletteValueToken][] = PALETTE_VALUES.map(
		(paletteValue: PaletteValue) => [
			paletteValue,
			getPenpotValueTokens(oklchToHsl(palette[paletteValue])),
		],
	);

	return fromEntries(paletteTokensEntries);
}

export function getPenpotFullPaletteCollectionTokens(
	fullPaletteCollection: FullPaletteCollection,
): PenpotFullPaletteCollectionTokens {
	const fullPaletteCollectionTokensEntries: [PaletteType, PenpotPaletteTokens][] =
		PALETTE_TYPES.map((paletteType: PaletteType) => [
			paletteType,
			getPenpotPaletteTokens(fullPaletteCollection[paletteType]),
		]);

	return fromEntries(fullPaletteCollectionTokensEntries);
}
