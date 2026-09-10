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

export const FONT_WEIGHT_VALUE_MAP = {
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

export const TYPEFACE_PROPERTY = {
	FONT: 'font',
	WEIGHT: 'weight',
	SIZE: 'size',
	LINE_HEIGHT: 'line-height'
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type TypefaceProperty = (typeof TYPEFACE_PROPERTY)[keyof typeof TYPEFACE_PROPERTY];

