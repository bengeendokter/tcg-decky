import { type, type Type } from 'arktype';

// function typeSafeObjectFromEntries<const T extends ReadonlyArray<readonly [PropertyKey, unknown]>>(
// 	entries: T,
// ): { [K in T[number] as K[0]]: K[1] } {
// 	return Object.fromEntries(entries) as { [K in T[number] as K[0]]: K[1] };
// }

// const PALETTE_TYPE_ENTRIES = [
// 	['PRIMARY', 'primary'],
// 	['SECONDARY', 'secondary'],
// 	['TERTIARY', 'tertiary'],
// 	['NEUTRAL', 'neutral'],
// 	['NEUTRAL_VARIANT', 'neutral-variant'],
// 	['ERROR', 'error'],
// ] as const satisfies [Uppercase<string>, Lowercase<string>][];

// const PALETTE_TYPES2 = PALETTE_TYPE_ENTRIES.map((entry) => {
// 	return entry[1];
// });

// const PALETTE_TYPE2 = typeSafeObjectFromEntries(PALETTE_TYPE_ENTRIES) satisfies Record<
// 	Uppercase<string>,
// 	Lowercase<string>
// >;

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

function mapPaletteValueToLightness(paletteValue: number): number {
	if (paletteValue === 0) {
		return 0;
	}

	const calculatedResult: number = -0.000872 * paletteValue ** 2 + 0.9504 * paletteValue + 13.47;
	return Math.min(calculatedResult, 100);
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

export type PaletteKey<T extends PaletteType> = `${T}${number}`;
export type SpecificPalette<T extends PaletteType> = Partial<Record<PaletteKey<T>, Oklch>>;

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

export function getPalette<T extends PaletteType>(
	palleteType: T,
	themeBaseColor: Oklch,
): SpecificPalette<T> {
	const palette: SpecificPalette<T> = [...Array(101).keys()].reduce(
		(acc: SpecificPalette<T>, value: number) => {
			return {
				...acc,
				[`${palleteType}${value}`]: getPaletteValueOklch(
					value,
					CHROMA_FACTOR[palleteType],
					getPaletteBaseColor(themeBaseColor, palleteType),
				),
			};
		},
		{},
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
		[value: number]: {
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
