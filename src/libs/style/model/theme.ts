import { PALETTE_TYPE, type PaletteType, type PaletteValue } from './palette';
import { entriesOf, fromEntries } from '@ark/util';

interface PaletteTypeValue {
	paletteType: PaletteType;
	paletteValue: PaletteValue;
}

const { PRIMARY, SECONDARY, TERTIARY, ERROR } = PALETTE_TYPE;
const ACCENT_PALETTE_TYPE = { PRIMARY, SECONDARY, TERTIARY, ERROR } satisfies Partial<
	typeof PALETTE_TYPE
>;

const FIXED_PALETTE_TYPE = { PRIMARY, SECONDARY, TERTIARY } satisfies Partial<typeof PALETTE_TYPE>;

export type AccentPaletteType = (typeof ACCENT_PALETTE_TYPE)[keyof typeof ACCENT_PALETTE_TYPE];
export type FixedPaletteType = (typeof FIXED_PALETTE_TYPE)[keyof typeof FIXED_PALETTE_TYPE];

type AccentRoleKeys<T extends AccentPaletteType> = [
	T,
	`on-${T}`,
	`${T}-container`,
	`on-${T}-container`,
];

type AccentRoleKey<T extends AccentPaletteType> = AccentRoleKeys<T>[number];

type FixedRoleKeys<T extends FixedPaletteType> = [
	`${T}-fixed`,
	`${T}-fixed-dim`,
	`on-${T}-fixed`,
	`on-${T}-fixed-variant`,
];

type FixedRoleKey<T extends FixedPaletteType> = FixedRoleKeys<T>[number];

function getAccentRoleKey<T extends AccentPaletteType>(accentPaletteType: T): AccentRoleKeys<T> {
	return [
		accentPaletteType,
		`on-${accentPaletteType}`,
		`${accentPaletteType}-container`,
		`on-${accentPaletteType}-container`,
	];
}

function getFixedRoleKey<T extends FixedPaletteType>(fixedPaletteType: T): FixedRoleKeys<T> {
	return [
		`${fixedPaletteType}-fixed`,
		`${fixedPaletteType}-fixed-dim`,
		`on-${fixedPaletteType}-fixed`,
		`on-${fixedPaletteType}-fixed-variant`,
	];
}

const PRIMARY_ROLE_KEYS = [
	...getAccentRoleKey(ACCENT_PALETTE_TYPE.PRIMARY),
	...getFixedRoleKey(FIXED_PALETTE_TYPE.PRIMARY),
] as const satisfies string[];
const SECONDARY_ROLE_KEYS = [
	...getAccentRoleKey(ACCENT_PALETTE_TYPE.SECONDARY),
	...getFixedRoleKey(FIXED_PALETTE_TYPE.SECONDARY),
] as const satisfies string[];
const TERTIARY_ROLE_KEYS = [
	...getAccentRoleKey(ACCENT_PALETTE_TYPE.TERTIARY),
	...getFixedRoleKey(FIXED_PALETTE_TYPE.TERTIARY),
] as const satisfies string[];
const ERROR_ROLE_KEYS = getAccentRoleKey(ACCENT_PALETTE_TYPE.ERROR) satisfies string[];

type PrimaryRoleKey =
	| AccentRoleKey<typeof ACCENT_PALETTE_TYPE.PRIMARY>
	| FixedRoleKey<typeof ACCENT_PALETTE_TYPE.PRIMARY>
	| 'inverse-primary';
type SecondaryRoleKey =
	| AccentRoleKey<typeof ACCENT_PALETTE_TYPE.SECONDARY>
	| FixedRoleKey<typeof ACCENT_PALETTE_TYPE.SECONDARY>;
type TertiaryRoleKey =
	| AccentRoleKey<typeof ACCENT_PALETTE_TYPE.TERTIARY>
	| FixedRoleKey<typeof ACCENT_PALETTE_TYPE.TERTIARY>;
type ErrorRoleKey = AccentRoleKey<typeof ACCENT_PALETTE_TYPE.ERROR>;

const SURFACE_ROLE_KEYS = [
	'surface',
	'surface-dim',
	'surface-bright',
	'surface-container-lowest',
	'surface-container-low',
	'surface-container',
	'surface-container-high',
	'surface-container-highest',
	'on-surface',
] as const satisfies string[];

const INVERSE_ROLE_KEYS = ['inverse-surface', 'inverse-on-surface'] as const satisfies string[];

const OUTLINE_ROLE_KEYS = ['outline', 'outline-variant'] as const satisfies string[];

const NEUTRAL_ROLE_KEYS = [
	...SURFACE_ROLE_KEYS,
	...INVERSE_ROLE_KEYS,
	'shadow',
	'scrim',
] as const satisfies string[];

type NeutralRoleKey = (typeof NEUTRAL_ROLE_KEYS)[number];

const NEUTRAL_VARIANT_ROLE_KEYS = [
	...OUTLINE_ROLE_KEYS,
	'on-surface-variant',
] as const satisfies string[];

type NeutralVariantRoleKey = (typeof NEUTRAL_VARIANT_ROLE_KEYS)[number];

type ThemeKey =
	| PrimaryRoleKey
	| SecondaryRoleKey
	| TertiaryRoleKey
	| ErrorRoleKey
	| NeutralRoleKey
	| NeutralVariantRoleKey;

type Theme = {
	[key in ThemeKey]: PaletteTypeValue;
};

type ThemeValueMap = {
	[key in ThemeKey]: PaletteValue;
};

function getRoleKeyEntries<T extends ThemeKey>(
	roleKeys: readonly T[],
	paletteType: PaletteType,
	themeValueMap: ThemeValueMap,
): [T, PaletteTypeValue][] {
	return roleKeys.map((roleKey) => [
		roleKey,
		{
			paletteType: paletteType,
			paletteValue: themeValueMap[roleKey],
		},
	]);
}

export function getTheme(themeValueMap: ThemeValueMap): Theme {
	const primaryRoleKeyEntries: [PrimaryRoleKey, PaletteTypeValue][] = getRoleKeyEntries(
		PRIMARY_ROLE_KEYS,
		PALETTE_TYPE.PRIMARY,
		themeValueMap,
	);

	const secondaryRoleKeyEntries: [SecondaryRoleKey, PaletteTypeValue][] = getRoleKeyEntries(
		SECONDARY_ROLE_KEYS,
		PALETTE_TYPE.SECONDARY,
		themeValueMap,
	);

	const tertiaryRoleKeyEntries: [TertiaryRoleKey, PaletteTypeValue][] = getRoleKeyEntries(
		TERTIARY_ROLE_KEYS,
		PALETTE_TYPE.TERTIARY,
		themeValueMap,
	);

	const errorRoleKeyEntries: [ErrorRoleKey, PaletteTypeValue][] = getRoleKeyEntries(
		ERROR_ROLE_KEYS,
		PALETTE_TYPE.ERROR,
		themeValueMap,
	);

	const neutralRoleKeyEntries: [NeutralRoleKey, PaletteTypeValue][] = getRoleKeyEntries(
		NEUTRAL_ROLE_KEYS,
		PALETTE_TYPE.NEUTRAL,
		themeValueMap,
	);

	const neutralVariantRoleKeyEntries: [NeutralVariantRoleKey, PaletteTypeValue][] =
		getRoleKeyEntries(NEUTRAL_VARIANT_ROLE_KEYS, PALETTE_TYPE.NEUTRAL_VARIANT, themeValueMap);

	return fromEntries([
		...primaryRoleKeyEntries,
		...secondaryRoleKeyEntries,
		...tertiaryRoleKeyEntries,
		...errorRoleKeyEntries,
		...neutralRoleKeyEntries,
		...neutralVariantRoleKeyEntries,
	]);
}

const LIGHT_THEME_VALUE_MAP = {
	primary: 40,
	'on-primary': 100,
	'primary-container': 90,
	'on-primary-container': 10,
	secondary: 40,
	'on-secondary': 100,
	'secondary-container': 90,
	'on-secondary-container': 10,
	tertiary: 40,
	'on-tertiary': 100,
	'tertiary-container': 90,
	'on-tertiary-container': 10,
	error: 40,
	'on-error': 100,
	'error-container': 90,
	'on-error-container': 10,
	surface: 98,
	'on-surface': 10,
	'on-surface-variant': 30,
	outline: 50,
	'outline-variant': 80,
	shadow: 0,
	scrim: 0,
	'inverse-surface': 20,
	'inverse-on-surface': 95,
	'inverse-primary': 80,
	'primary-fixed': 90,
	'on-primary-fixed': 10,
	'primary-fixed-dim': 80,
	'on-primary-fixed-variant': 30,
	'secondary-fixed': 90,
	'on-secondary-fixed': 10,
	'secondary-fixed-dim': 80,
	'on-secondary-fixed-variant': 30,
	'tertiary-fixed': 90,
	'on-tertiary-fixed': 10,
	'tertiary-fixed-dim': 80,
	'on-tertiary-fixed-variant': 30,
	'surface-dim': 87,
	'surface-bright': 98,
	'surface-container-lowest': 100,
	'surface-container-low': 96,
	'surface-container': 94,
	'surface-container-high': 92,
	'surface-container-highest': 90,
} as const satisfies ThemeValueMap;

const LIGHT_MEDIUM_CONTRAST_THEME_VALUE_MAP = {
	primary: 23,
	'on-primary': 100,
	'primary-container': 46,
	'on-primary-container': 100,
	secondary: 23,
	'on-secondary': 100,
	'secondary-container': 46,
	'on-secondary-container': 100,
	tertiary: 23,
	'on-tertiary': 100,
	'tertiary-container': 46,
	'on-tertiary-container': 100,
	error: 23,
	'on-error': 100,
	'error-container': 46,
	'on-error-container': 100,
	surface: 98,
	'on-surface': 5,
	'on-surface-variant': 23,
	outline: 35,
	'outline-variant': 46,
	shadow: 0,
	scrim: 0,
	'inverse-surface': 20,
	'inverse-on-surface': 95,
	'inverse-primary': 80,
	'primary-fixed': 46,
	'on-primary-fixed': 100,
	'primary-fixed-dim': 36,
	'on-primary-fixed-variant': 100,
	'secondary-fixed': 46,
	'on-secondary-fixed': 100,
	'secondary-fixed-dim': 36,
	'on-secondary-fixed-variant': 100,
	'tertiary-fixed': 46,
	'on-tertiary-fixed': 100,
	'tertiary-fixed-dim': 36,
	'on-tertiary-fixed-variant': 100,
	'surface-dim': 80,
	'surface-bright': 98,
	'surface-container-lowest': 100,
	'surface-container-low': 96,
	'surface-container': 92,
	'surface-container-high': 88,
	'surface-container-highest': 84,
} as const satisfies ThemeValueMap;

const LIGHT_HIGH_CONTRAST_THEME_VALUE_MAP = {
	primary: 18,
	'on-primary': 100,
	'primary-container': 31,
	'on-primary-container': 100,
	secondary: 18,
	'on-secondary': 100,
	'secondary-container': 31,
	'on-secondary-container': 100,
	tertiary: 18,
	'on-tertiary': 100,
	'tertiary-container': 31,
	'on-tertiary-container': 100,
	error: 18,
	'on-error': 100,
	'error-container': 31,
	'on-error-container': 100,
	surface: 98,
	'on-surface': 0,
	'on-surface-variant': 0,
	outline: 18,
	'outline-variant': 31,
	shadow: 0,
	scrim: 0,
	'inverse-surface': 20,
	'inverse-on-surface': 100,
	'inverse-primary': 80,
	'primary-fixed': 31,
	'on-primary-fixed': 100,
	'primary-fixed-dim': 21,
	'on-primary-fixed-variant': 100,
	'secondary-fixed': 31,
	'on-secondary-fixed': 100,
	'secondary-fixed-dim': 21,
	'on-secondary-fixed-variant': 100,
	'tertiary-fixed': 31,
	'on-tertiary-fixed': 100,
	'tertiary-fixed-dim': 21,
	'on-tertiary-fixed-variant': 100,
	'surface-dim': 75,
	'surface-bright': 98,
	'surface-container-lowest': 100,
	'surface-container-low': 95,
	'surface-container': 90,
	'surface-container-high': 85,
	'surface-container-highest': 80,
} as const satisfies ThemeValueMap;

const DARK_THEME_VALUE_MAP = {
	primary: 80,
	'on-primary': 20,
	'primary-container': 30,
	'on-primary-container': 90,
	secondary: 80,
	'on-secondary': 20,
	'secondary-container': 30,
	'on-secondary-container': 90,
	tertiary: 80,
	'on-tertiary': 20,
	'tertiary-container': 30,
	'on-tertiary-container': 90,
	error: 80,
	'on-error': 20,
	'error-container': 30,
	'on-error-container': 90,
	surface: 6,
	'on-surface': 90,
	'on-surface-variant': 80,
	outline: 60,
	'outline-variant': 30,
	shadow: 0,
	scrim: 0,
	'inverse-surface': 90,
	'inverse-on-surface': 20,
	'inverse-primary': 40,
	'primary-fixed': 90,
	'on-primary-fixed': 10,
	'primary-fixed-dim': 80,
	'on-primary-fixed-variant': 30,
	'secondary-fixed': 90,
	'on-secondary-fixed': 10,
	'secondary-fixed-dim': 80,
	'on-secondary-fixed-variant': 30,
	'tertiary-fixed': 90,
	'on-tertiary-fixed': 10,
	'tertiary-fixed-dim': 80,
	'on-tertiary-fixed-variant': 30,
	'surface-dim': 6,
	'surface-bright': 24,
	'surface-container-lowest': 4,
	'surface-container-low': 10,
	'surface-container': 12,
	'surface-container-high': 17,
	'surface-container-highest': 22,
} as const satisfies ThemeValueMap;

const DARK_MEDIUM_CONTRAST_THEME_VALUE_MAP = {
	primary: 88,
	'on-primary': 15,
	'primary-container': 60,
	'on-primary-container': 0,
	secondary: 88,
	'on-secondary': 15,
	'secondary-container': 60,
	'on-secondary-container': 0,
	tertiary: 88,
	'on-tertiary': 15,
	'tertiary-container': 60,
	'on-tertiary-container': 0,
	error: 88,
	'on-error': 15,
	'error-container': 60,
	'on-error-container': 0,
	surface: 6,
	'on-surface': 100,
	'on-surface-variant': 88,
	outline: 72,
	'outline-variant': 60,
	shadow: 0,
	scrim: 0,
	'inverse-surface': 90,
	'inverse-on-surface': 17,
	'inverse-primary': 31,
	'primary-fixed': 90,
	'on-primary-fixed': 5,
	'primary-fixed-dim': 80,
	'on-primary-fixed-variant': 23,
	'secondary-fixed': 90,
	'on-secondary-fixed': 5,
	'secondary-fixed-dim': 80,
	'on-secondary-fixed-variant': 23,
	'tertiary-fixed': 90,
	'on-tertiary-fixed': 5,
	'tertiary-fixed-dim': 80,
	'on-tertiary-fixed-variant': 23,
	'surface-dim': 6,
	'surface-bright': 29,
	'surface-container-lowest': 2,
	'surface-container-low': 11,
	'surface-container': 16,
	'surface-container-high': 21,
	'surface-container-highest': 26,
} as const satisfies ThemeValueMap;

const DARK_HIGH_CONTRAST_THEME_VALUE_MAP = {
	primary: 95,
	'on-primary': 0,
	'primary-container': 79,
	'on-primary-container': 3,
	secondary: 95,
	'on-secondary': 0,
	'secondary-container': 79,
	'on-secondary-container': 3,
	tertiary: 95,
	'on-tertiary': 0,
	'tertiary-container': 79,
	'on-tertiary-container': 3,
	error: 95,
	'on-error': 0,
	'error-container': 79,
	'on-error-container': 3,
	surface: 6,
	'on-surface': 100,
	'on-surface-variant': 100,
	outline: 95,
	'outline-variant': 79,
	shadow: 0,
	scrim: 0,
	'inverse-surface': 90,
	'inverse-on-surface': 0,
	'inverse-primary': 31,
	'primary-fixed': 90,
	'on-primary-fixed': 0,
	'primary-fixed-dim': 80,
	'on-primary-fixed-variant': 5,
	'secondary-fixed': 90,
	'on-secondary-fixed': 0,
	'secondary-fixed-dim': 80,
	'on-secondary-fixed-variant': 5,
	'tertiary-fixed': 90,
	'on-tertiary-fixed': 0,
	'tertiary-fixed-dim': 80,
	'on-tertiary-fixed-variant': 5,
	'surface-dim': 6,
	'surface-bright': 34,
	'surface-container-lowest': 0,
	'surface-container-low': 12,
	'surface-container': 20,
	'surface-container-high': 25,
	'surface-container-highest': 30,
} as const satisfies ThemeValueMap;

export const lightTheme: Theme = getTheme(LIGHT_THEME_VALUE_MAP);
export const lightMediumContrastTheme: Theme = getTheme(LIGHT_MEDIUM_CONTRAST_THEME_VALUE_MAP);
export const lightHighContrastTheme: Theme = getTheme(LIGHT_HIGH_CONTRAST_THEME_VALUE_MAP);
export const darkTheme: Theme = getTheme(DARK_THEME_VALUE_MAP);
export const darkMediumContrastTheme: Theme = getTheme(DARK_MEDIUM_CONTRAST_THEME_VALUE_MAP);
export const darkHighContrastTheme: Theme = getTheme(DARK_HIGH_CONTRAST_THEME_VALUE_MAP);

type ThemeValueToken = {
	$type: 'color';
	$value: `{md.ref.palette.${PaletteType}.${PaletteValue}}`;
};

export type ThemeTokens = {
	[key in ThemeKey]: ThemeValueToken;
};

function getThemeValueToken(paletteTypeValue: PaletteTypeValue): ThemeValueToken {
	return {
		$type: 'color',
		$value: `{md.ref.palette.${paletteTypeValue.paletteType}.${paletteTypeValue.paletteValue}}`,
	};
}

export function getThemeTokens(theme: Theme): ThemeTokens {
	const themeTokensEntries: [ThemeKey, ThemeValueToken][] = entriesOf(theme).map(
		([themeKey, paletteTypeValue]) => [themeKey, getThemeValueToken(paletteTypeValue)],
	);

	return fromEntries(themeTokensEntries);
}

export const THEME_NAME = {
	LIGHT: 'light',
	LIGHT_MC: 'light-mc',
	LIGHT_HC: 'light-hc',
	DARK: 'dark',
	DARK_MC: 'dark-mc',
	DARK_HC: 'dark-hc',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type ThemeName = (typeof THEME_NAME)[keyof typeof THEME_NAME];

export const THEME_NAMES = [THEME_NAME.LIGHT, THEME_NAME.LIGHT_MC, THEME_NAME.LIGHT_HC, THEME_NAME.DARK, THEME_NAME.DARK_MC, THEME_NAME.DARK_HC] as const satisfies ThemeName[];

export const THEME_NAME_THEME_MAP = {
	[THEME_NAME.LIGHT]: lightTheme,
	[THEME_NAME.LIGHT_MC]: lightMediumContrastTheme,
	[THEME_NAME.LIGHT_HC]: lightHighContrastTheme,
	[THEME_NAME.DARK]: darkTheme,
	[THEME_NAME.DARK_MC]: darkMediumContrastTheme,
	[THEME_NAME.DARK_HC]: darkHighContrastTheme,
} as const satisfies Record<ThemeName, Theme>;

export const THEME_NAME_THEME_TOKENS_MAP = {
	[THEME_NAME.LIGHT]: getThemeTokens(THEME_NAME_THEME_MAP[THEME_NAME.LIGHT]),
	[THEME_NAME.LIGHT_MC]: getThemeTokens(THEME_NAME_THEME_MAP[THEME_NAME.LIGHT_MC]),
	[THEME_NAME.LIGHT_HC]: getThemeTokens(THEME_NAME_THEME_MAP[THEME_NAME.LIGHT_HC]),
	[THEME_NAME.DARK]: getThemeTokens(THEME_NAME_THEME_MAP[THEME_NAME.DARK]),
	[THEME_NAME.DARK_MC]: getThemeTokens(THEME_NAME_THEME_MAP[THEME_NAME.DARK_MC]),
	[THEME_NAME.DARK_HC]: getThemeTokens(THEME_NAME_THEME_MAP[THEME_NAME.DARK_HC]),
} as const satisfies Record<ThemeName, ThemeTokens>;
