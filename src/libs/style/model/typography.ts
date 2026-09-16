export const TYPESCALE_SIZE = {
	LARGE: 'large',
	MEDIUM: 'medium',
	SMALL: 'small',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type TypescaleSize = (typeof TYPESCALE_SIZE)[keyof typeof TYPESCALE_SIZE];

export const TYPESCALE_TYPE = {
	DISPLAY: 'display',
	HEADLINE: 'headline',
	TITLE: 'title',
	LABEL: 'label',
	BODY: 'body',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type TypescaleType = (typeof TYPESCALE_TYPE)[keyof typeof TYPESCALE_TYPE];

export type Typescale = `${TypescaleType}-${TypescaleSize}`;

export const FONT_WEIGHT_TYPE = {
	REGULAR: 'regular',
	MEDIUM: 'medium',
	BOLD: 'bold',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type FontWeightType = (typeof FONT_WEIGHT_TYPE)[keyof typeof FONT_WEIGHT_TYPE];

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

type TypescaleNumberProperty = `${Typescale}-${TypefacePropertyNumberType}`;

const TYPESCALE_NUMBER_PROPERTY_VALUE_MAP = {
	'display-large-size': 57,
	'display-large-line-height': 64,
	'display-medium-size': 45,
	'display-medium-line-height': 52,
	'display-small-size': 36,
	'display-small-line-height': 44,
	'headline-large-size': 32,
	'headline-large-line-height': 40,
	'headline-medium-size': 28,
	'headline-medium-line-height': 36,
	'headline-small-size': 24,
	'headline-small-line-height': 32,
	'title-large-size': 22,
	'title-large-line-height': 28,
	'title-medium-size': 16,
	'title-medium-line-height': 24,
	'title-small-size': 14,
	'title-small-line-height': 20,
	'body-large-size': 16,
	'body-large-line-height': 24,
	'body-medium-size': 14,
	'body-medium-line-height': 20,
	'body-small-size': 12,
	'body-small-line-height': 16,
	'label-large-size': 14,
	'label-large-line-height': 20,
	'label-medium-size': 12,
	'label-medium-line-height': 16,
	'label-small-size': 11,
	'label-small-line-height': 16,
} as const satisfies Record<TypescaleNumberProperty, number>;

export interface TypographyToken {
	$type: 'typography';
	$value: {
		fontFamily: string;
		fontSize: {
			value: number;
			unit: 'px';
		};
		fontWeight: number;
		letterSpacing: {
			value: number;
			unit: 'px';
		};
		lineHeight: number;
	};
}

export type TypographyTokens = {
	[key in Typescale]: TypographyToken;
}
