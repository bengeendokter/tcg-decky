export interface Metadata {
	tokenSetOrder: string[];
	activeThemes: string[];
	activeSets: string[];
}

export interface ThemeMetadata {
	name: string;
	selectedTokenSets: {
		[key: string]: 'enabled' | 'disabled';
	};
}

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

export const THEME_NAME = {
	LIGHT: 'Light',
	DARK: 'Dark',
} as const satisfies Record<Uppercase<string>, string>;

export type ThemeName = (typeof THEME_NAME)[keyof typeof THEME_NAME];

export const THEME_NAME_SET_MAP = {
	[THEME_NAME.LIGHT]: [SET_NAME.PALETTE, SET_NAME.LIGHT],
	[THEME_NAME.DARK]: [SET_NAME.PALETTE, SET_NAME.DARK],
} as const satisfies Record<ThemeName, SetName[]>;
