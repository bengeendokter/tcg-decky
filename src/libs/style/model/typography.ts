import { fromEntries } from '@ark/util';
import type { UnionToTuple } from 'type-fest';

export const TYPESCALE_SIZE = {
	LARGE: 'large',
	MEDIUM: 'medium',
	SMALL: 'small',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type TypescaleSize = (typeof TYPESCALE_SIZE)[keyof typeof TYPESCALE_SIZE];

export const TYPESCALE_SIZES = [
	TYPESCALE_SIZE.LARGE,
	TYPESCALE_SIZE.MEDIUM,
	TYPESCALE_SIZE.SMALL,
] as const satisfies UnionToTuple<TypescaleSize>;

export const TYPESCALE_TYPE = {
	DISPLAY: 'display',
	HEADLINE: 'headline',
	TITLE: 'title',
	LABEL: 'label',
	BODY: 'body',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type TypescaleType = (typeof TYPESCALE_TYPE)[keyof typeof TYPESCALE_TYPE];

export const TYPESCALE_TYPES = [
	TYPESCALE_TYPE.DISPLAY,
	TYPESCALE_TYPE.HEADLINE,
	TYPESCALE_TYPE.TITLE,
	TYPESCALE_TYPE.LABEL,
	TYPESCALE_TYPE.BODY,
] as const satisfies UnionToTuple<TypescaleType>;

export type Typescale = `${TypescaleType}-${TypescaleSize}`;

const typescales: [TypescaleType, TypescaleSize][] = TYPESCALE_TYPES.flatMap((typescaleType) =>
	TYPESCALE_SIZES.map((typescaleSize): [TypescaleType, TypescaleSize] => [
		typescaleType,
		typescaleSize,
	]),
);

export const FONT_WEIGHT_TYPE = {
	REGULAR: 'regular',
	MEDIUM: 'medium',
	BOLD: 'bold',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type FontWeightType = (typeof FONT_WEIGHT_TYPE)[keyof typeof FONT_WEIGHT_TYPE];

export const FONT_WEIGHT_TYPES = [
	FONT_WEIGHT_TYPE.MEDIUM,
	FONT_WEIGHT_TYPE.REGULAR,
	FONT_WEIGHT_TYPE.BOLD,
] as const satisfies UnionToTuple<FontWeightType>;

const FONT_WEIGHT_VALUE_MAP = {
	[FONT_WEIGHT_TYPE.REGULAR]: 400,
	[FONT_WEIGHT_TYPE.MEDIUM]: 500,
	[FONT_WEIGHT_TYPE.BOLD]: 700,
} as const satisfies Record<FontWeightType, number>;

export type FontWeightValue = (typeof FONT_WEIGHT_VALUE_MAP)[keyof typeof FONT_WEIGHT_VALUE_MAP];

export const TYPEFACE = {
	BRAND: 'brand',
	PLAIN: 'plain',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type Typeface = (typeof TYPEFACE)[keyof typeof TYPEFACE];

export const TYPEFACES = [TYPEFACE.BRAND, TYPEFACE.PLAIN] as const satisfies UnionToTuple<Typeface>;

export const TYPEFACE_FONT_FAMILY_MAP = {
	[TYPEFACE.BRAND]: 'sans-serif',
	[TYPEFACE.PLAIN]: 'sans-serif',
} as const satisfies Record<Typeface, string>;

export const TYPESCALE_TYPE_TYPEFACE_MAP = {
	[TYPESCALE_TYPE.DISPLAY]: TYPEFACE.BRAND,
	[TYPESCALE_TYPE.HEADLINE]: TYPEFACE.BRAND,
	[TYPESCALE_TYPE.TITLE]: TYPEFACE.PLAIN,
	[TYPESCALE_TYPE.LABEL]: TYPEFACE.PLAIN,
	[TYPESCALE_TYPE.BODY]: TYPEFACE.PLAIN,
} as const satisfies Record<TypescaleType, Typeface>;

export const TYPESCALE_TYPE_FONT_WEIGHT_TYPE_MAP = {
	[TYPESCALE_TYPE.DISPLAY]: FONT_WEIGHT_TYPE.REGULAR,
	[TYPESCALE_TYPE.HEADLINE]: FONT_WEIGHT_TYPE.REGULAR,
	[TYPESCALE_TYPE.TITLE]: FONT_WEIGHT_TYPE.REGULAR,
	[TYPESCALE_TYPE.LABEL]: FONT_WEIGHT_TYPE.REGULAR,
	[TYPESCALE_TYPE.BODY]: FONT_WEIGHT_TYPE.MEDIUM,
} as const satisfies Record<TypescaleType, FontWeightType>;

export const TYPEFACE_PROPERTY_TYPE = {
	FONT: 'font',
	WEIGHT: 'weight',
	SIZE: 'size',
	LINE_HEIGHT: 'line-height',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type TypefacePropertyType =
	(typeof TYPEFACE_PROPERTY_TYPE)[keyof typeof TYPEFACE_PROPERTY_TYPE];
export type TypefacePropertyNumberType = Exclude<
	TypefacePropertyType,
	typeof TYPEFACE_PROPERTY_TYPE.FONT | typeof TYPEFACE_PROPERTY_TYPE.WEIGHT
>;

const TYPESCALE_FONT_SIZE_MAP = {
	'display-large-size': 57,
	'display-medium-size': 45,
	'display-small-size': 36,
	'headline-large-size': 32,
	'headline-medium-size': 28,
	'headline-small-size': 24,
	'title-large-size': 22,
	'title-medium-size': 16,
	'title-small-size': 14,
	'body-large-size': 16,
	'body-medium-size': 14,
	'body-small-size': 12,
	'label-large-size': 14,
	'label-medium-size': 12,
	'label-small-size': 11,
} as const satisfies Record<`${Typescale}-size`, number>;

const TYPESCALE_LINE_HEIGHT_MAP = {
	'display-large-line-height': 64,
	'display-medium-line-height': 52,
	'display-small-line-height': 44,
	'headline-large-line-height': 40,
	'headline-medium-line-height': 36,
	'headline-small-line-height': 32,
	'title-large-line-height': 28,
	'title-medium-line-height': 24,
	'title-small-line-height': 20,
	'body-large-line-height': 24,
	'body-medium-line-height': 20,
	'body-small-line-height': 16,
	'label-large-line-height': 20,
	'label-medium-line-height': 16,
	'label-small-line-height': 16,
} as const satisfies Record<`${Typescale}-line-height`, number>;

export type FontFamilyToken = {
	$type: 'fontFamily';
	$value: string;
};

export type FontFamilyTokens = {
	[key in Typeface]: FontFamilyToken;
};

export type TypescaleFontFamilyTokens = {
	[key in `${Typescale}-font`]: `{md.ref.typeface.font.${Typeface}}`;
};

export function getTypescaleFontFamilyTokens(): TypescaleFontFamilyTokens {
	const typescaleFontFamilyTokensEntries: [
		`${Typescale}-font`,
		`{md.ref.typeface.font.${Typeface}}`,
	][] = typescales.map(([typescaleType, typescaleSize]) => [
		`${typescaleType}-${typescaleSize}-font`,
		`{md.ref.typeface.font.${TYPESCALE_TYPE_TYPEFACE_MAP[typescaleType]}}`,
	]);

	return fromEntries(typescaleFontFamilyTokensEntries);
}

export type FontWeightToken = {
	$type: 'fontWeight';
	$value: number;
};

export type FontWeightTokens = {
	[key in FontWeightType]: FontWeightToken;
};

export type TypescaleFontWeightTokens = {
	[key in `${Typescale}-weight`]: `{md.ref.typeface.weight.${FontWeightType}}`;
};

export function getTypescaleFontWeightTokens(): TypescaleFontWeightTokens {
	const typescaleFontWeightTokensEntries: [
		`${Typescale}-weight`,
		`{md.ref.typeface.weight.${FontWeightType}}`,
	][] = typescales.map(([typescaleType, typescaleSize]) => [
		`${typescaleType}-${typescaleSize}-weight`,
		`{md.ref.typeface.weight.${TYPESCALE_TYPE_FONT_WEIGHT_TYPE_MAP[typescaleType]}}`,
	]);

	return fromEntries(typescaleFontWeightTokensEntries);
}

export type FontSizeToken = {
	$type: 'dimension';
	$value: {
		value: number;
		unit: 'px';
	};
};

export type TypescaleFontSizeTokens = {
	[key in `${Typescale}-size`]: FontSizeToken;
};

export function getTypescaleFontSizeTokens(): TypescaleFontSizeTokens {
	const typescaleFontSizeTokensEntries: [`${Typescale}-size`, FontSizeToken][] = typescales.map(
		([typescaleType, typescaleSize]) => [
			`${typescaleType}-${typescaleSize}-size`,
			{
				$type: 'dimension',
				$value: {
					value: TYPESCALE_FONT_SIZE_MAP[`${typescaleType}-${typescaleSize}-size`],
					unit: 'px',
				},
			},
		],
	);

	return fromEntries(typescaleFontSizeTokensEntries);
}

export type LineHeightToken = {
	$type: 'dimension';
	$value: {
		value: number;
		unit: 'px';
	};
};

export type TypescaleLineHeightTokens = {
	[key in `${Typescale}-line-height`]: LineHeightToken;
};

export function getTypescaleLineHeightTokens(): TypescaleLineHeightTokens {
	const typescaleLineHeightTokensEntries: [`${Typescale}-line-height`, LineHeightToken][] = typescales.map(
		([typescaleType, typescaleSize]) => [
			`${typescaleType}-${typescaleSize}-line-height`,
			{
				$type: 'dimension',
				$value: {
					value: TYPESCALE_LINE_HEIGHT_MAP[`${typescaleType}-${typescaleSize}-line-height`],
					unit: 'px',
				},
			},
		],
	);

	return fromEntries(typescaleLineHeightTokensEntries);
}

export type TypographyToken = {
	$type: 'typography';
	$value: {
		fontFamily: `{md.sys.typescale.${Typescale}-font}`;
		fontSize: `{md.sys.typescale.${Typescale}-size}`;
		fontWeight: `{md.sys.typescale.${Typescale}-weight}`;
		lineHeight: `{md.sys.typescale.${Typescale}-line-height}`;
	};
};

export type TypographyTokens = {
	[key in Typescale]: TypographyToken;
};

function getFontFamilyToken(typeface: Typeface): FontFamilyToken {
	return {
		$type: 'fontFamily',
		$value: TYPEFACE_FONT_FAMILY_MAP[typeface],
	};
}

export function getFontFamilyTokens(): FontFamilyTokens {
	const fontFamilyTokensEntries: [Typeface, FontFamilyToken][] = TYPEFACES.map((typeface) => [
		typeface,
		getFontFamilyToken(typeface),
	]);

	return fromEntries(fontFamilyTokensEntries);
}

function getFontWeightToken(fontWeightType: FontWeightType): FontWeightToken {
	return {
		$type: 'fontWeight',
		$value: FONT_WEIGHT_VALUE_MAP[fontWeightType],
	};
}

export function getFontWeightTokens(): FontWeightTokens {
	const fontWeightTokensEntries: [FontWeightType, FontWeightToken][] = FONT_WEIGHT_TYPES.map(
		(fontWeightType) => [fontWeightType, getFontWeightToken(fontWeightType)],
	);

	return fromEntries(fontWeightTokensEntries);
}

function getTypographyToken(
	typescaleType: TypescaleType,
	typescaleSize: TypescaleSize,
): TypographyToken {
	return {
		$type: 'typography',
		$value: {
			fontFamily: `{md.sys.typescale.${typescaleType}-${typescaleSize}-font}`,
			fontSize: `{md.sys.typescale.${typescaleType}-${typescaleSize}-size}`,
			fontWeight: `{md.sys.typescale.${typescaleType}-${typescaleSize}-weight}`,
			lineHeight: `{md.sys.typescale.${typescaleType}-${typescaleSize}-line-height}`,
		},
	};
}

export function getTypographyTokens(): TypographyTokens {
	const typescaleTokensEntries: [Typescale, TypographyToken][] = typescales.map(
		([typescaleType, typescaleSize]: [TypescaleType, TypescaleSize]) => [
			`${typescaleType}-${typescaleSize}`,
			getTypographyToken(typescaleType, typescaleSize),
		],
	);

	return fromEntries(typescaleTokensEntries);
}
