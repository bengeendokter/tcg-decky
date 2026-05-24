import { type, type Type } from 'arktype';

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
] as const satisfies PaletteType[];

export const paletteTypeValidator: Type<PaletteType> = type.enumerated(...PALETTE_TYPES);

export const PALETTE_VALUES = [
	0, 2, 3, 4, 5, 6, 10, 11, 12, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 29, 30, 31, 34, 35, 36,
	40, 46, 50, 60, 70, 72, 75, 79, 80, 84, 85, 87, 88, 90, 92, 94, 95, 96, 98, 100,
] as const satisfies number[];

export type PaletteValue = (typeof PALETTE_VALUES)[number];

export const paletteValueValidator: Type<PaletteValue> = type.enumerated(...PALETTE_VALUES);

export const PALETTE_VALUE_LIGHTNESS_MAP = {
	0: 0,
	2: 14,
	3: 16,
	4: 17,
	5: 18,
	6: 20,
	10: 23,
	11: 24,
	12: 25,
	15: 28,
	16: 29,
	17: 30,
	18: 31,
	20: 33,
	21: 33,
	22: 34,
	23: 35,
	24: 36,
	25: 36,
	26: 37,
	29: 40,
	30: 41,
	31: 42,
	34: 44,
	35: 45,
	36: 46,
	40: 51,
	46: 55,
	50: 59,
	60: 68,
	70: 76,
	72: 77,
	75: 80,
	79: 83,
	80: 84,
	84: 87,
	85: 88,
	87: 89,
	88: 90,
	90: 92,
	92: 94,
	94: 95,
	95: 96,
	96: 97,
	98: 98,
	100: 100,
} as const satisfies Record<PaletteValue, number>;

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

const Semver = type("/^(\\d+)\\.(\\d+)\\.(\\d+)$/")

export type PaletteKey<T extends PaletteType> = `${T}${PaletteValue}`;
export type SpecificPalette<T extends PaletteType> = Record<PaletteKey<T>, Oklch>;

export type PalettePrimary = SpecificPalette<typeof PALETTE_TYPE.PRIMARY>;
export type PaletteSecondary = SpecificPalette<typeof PALETTE_TYPE.SECONDARY>;
export type PaletteTertiary = SpecificPalette<typeof PALETTE_TYPE.TERTIARY>;
export type PaletteNeutral = SpecificPalette<typeof PALETTE_TYPE.NEUTRAL>;
export type PaletteNeutralVariant = SpecificPalette<typeof PALETTE_TYPE.NEUTRAL_VARIANT>;
export type PaletteError = SpecificPalette<typeof PALETTE_TYPE.ERROR>;

export type Palette =
	| PalettePrimary
	| PaletteSecondary
	| PaletteTertiary
	| PaletteNeutral
	| PaletteNeutralVariant
	| PaletteError;

export function getPaletteValueOklch(
	palleteValue: PaletteValue,
	chromaFactor: ChromaFactor,
	baseColor: Oklch,
): Oklch {
	return {
		l: PALETTE_VALUE_LIGHTNESS_MAP[palleteValue],
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

export function getPalette<T extends PaletteType>(
	palleteType: T,
	themeBaseColor: Oklch,
): SpecificPalette<T> {
	const palette: SpecificPalette<T> = PALETTE_VALUES.reduce(
		(acc: Partial<SpecificPalette<T>>, value: PaletteValue) => {
			return {
				...acc,
				[`${palleteType}${value}`]: getPaletteValueOklch(
					value,
					CHROMA_FACTOR[palleteType],
					getPaletteBaseColor(themeBaseColor, palleteType),
				),
			};
		},
		{} satisfies Partial<SpecificPalette<T>>,
	);

	return palette;
}

export function getPalettePrimary(themeBaseColor: Oklch): PalettePrimary {
	return getPalette(PALETTE_TYPE.PRIMARY, themeBaseColor);
}

export function getPaletteSecondary(themeBaseColor: Oklch): PaletteSecondary {
	return getPalette(PALETTE_TYPE.SECONDARY, themeBaseColor);
}

export function getPaletteTertiary(themeBaseColor: Oklch): PaletteTertiary {
	return getPalette(PALETTE_TYPE.TERTIARY, themeBaseColor);
}

export function getPaletteNeutral(themeBaseColor: Oklch): PaletteNeutral {
	return getPalette(PALETTE_TYPE.NEUTRAL, themeBaseColor);
}

export function getPaletteNeutralVariant(themeBaseColor: Oklch): PaletteNeutralVariant {
	return getPalette(PALETTE_TYPE.NEUTRAL_VARIANT, themeBaseColor);
}

export function getPaletteError(themeBaseColor: Oklch): PaletteError {
	return getPalette(PALETTE_TYPE.ERROR, themeBaseColor);
}

type OklchPaletteColorTokens = {
	[paletteType in PaletteType]?: {
		[paletteValue in PaletteValue]?: {
			$type: 'color';
			$value: {
				colorSpace: 'oklch';
				components: [number, number, number];
			};
		};
	};
};

const oklchPaletteColorTokens: OklchPaletteColorTokens = {
	primary: {
		0: {
			$type: 'color',
			$value: {
				colorSpace: 'oklch',
				components: [0.7016, 0.3225, 328.363],
			},
		},

		2: {
			$type: 'color',
			$value: {
				colorSpace: 'oklch',
				components: [0.7016, 0.3225, 328.363],
			},
		},
	},
};

// function paletteToTokens(palettes: Palette):OklchPaletteColorTokens {

// 	return palettes;
// }

// function palettesToTokens(...palettes: Palette[]): OklchPaletteColorTokens {
// 	return palettes.reduce((tokens: OklchPaletteColorTokens, palette: Palette) => {
// 		const currentToken: OklchPaletteColorTokens = paletteToTokens(palette);
// 		return {...tokens, ...currentToken};
// 	}, {} satisfies OklchPaletteColorTokens);
// }
