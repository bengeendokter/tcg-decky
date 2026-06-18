export const SET_NAME = {
	PALETTE: 'palette',
	LIGHT: 'light',
	LIGHT_MC: 'light-mc',
	LIGHT_HC: 'light-hc',
	DARK: 'dark',
	DARK_MC: 'dark-mc',
	DARK_HC: 'dark-hc',
} as const satisfies Record<Uppercase<string>, Lowercase<string>>;

export type SetName = (typeof SET_NAME)[keyof typeof SET_NAME];

export const THEME_GROUP_NAME = {
	BRAND: 'Brand',
	COLOR_SCHEME: 'Color Scheme',
} as const satisfies Record<Uppercase<string>, string>;

export type ThemeGroupName = (typeof THEME_GROUP_NAME)[keyof typeof THEME_GROUP_NAME];

export const BRAND_THEME = {
	PURPLE: 'Purple',
} as const satisfies Record<Uppercase<string>, string>;

export type BrandTheme = (typeof BRAND_THEME)[keyof typeof BRAND_THEME];

export type BrandThemeFullName = `${typeof THEME_GROUP_NAME.BRAND}/${BrandTheme}`;

export const COLOR_SCHEME_THEME = {
	LIGHT: 'Light',
	DARK: 'Dark',
} as const satisfies Record<Uppercase<string>, string>;

export type ColorSchemeTheme = (typeof COLOR_SCHEME_THEME)[keyof typeof COLOR_SCHEME_THEME];

export type ColorSchemeThemeFullName =
	`${typeof THEME_GROUP_NAME.COLOR_SCHEME}/${ColorSchemeTheme}`;

export type ThemeFullName = BrandThemeFullName | ColorSchemeThemeFullName;

export type ThemeShortNameGeneric<T = ThemeFullName> =
	T extends `${ThemeGroupName}/${infer ShortName}` ? ShortName : never;

export type ThemeShortName = ThemeShortNameGeneric;

export const THEME_GROUP = {
	[THEME_GROUP_NAME.BRAND]: BRAND_THEME,
	[THEME_GROUP_NAME.COLOR_SCHEME]: COLOR_SCHEME_THEME,
} as const satisfies Record<ThemeGroupName, Record<Uppercase<string>, string>>;

export interface Metadata {
	tokenSetOrder: SetName[];
	activeThemes: ThemeFullName[];
	activeSets?: SetName[];
}

export interface ThemeMetadata {
	name: ThemeShortName;
	group: ThemeGroupName;
	selectedTokenSets: {
		[key in SetName]?: 'enabled' | 'disabled';
	};
}
